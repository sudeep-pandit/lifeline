"use client";

import {
  AlertTriangle,
  Check,
  Clipboard,
  Download,
  File,
  FileImage,
  Folder,
  FolderOpen,
  FolderPlus,
  Grid3X3,
  Image as ImageIcon,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

type MediaFolder = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    media: number;
    children: number;
  };
};

type MediaItem = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
  folderId: string | null;
  folder: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type MediaStats = {
  total: number;
  images: number;
  folders: number;
  storage: number;
};

type ViewMode = "grid" | "list";

type ModalType =
  | "new-folder"
  | "rename-folder"
  | "move-folder"
  | "delete-folder"
  | "media-details"
  | "move-media"
  | "delete-media"
  | null;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export default function MediaClient() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);

  const [stats, setStats] = useState<MediaStats>({
    total: 0,
    images: 0,
    folders: 0,
    storage: 0,
  });

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder | null>(
    null,
  );
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const [folderName, setFolderName] = useState("");
  const [targetFolderId, setTargetFolderId] = useState<string>("");

  const [editAlt, setEditAlt] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [openFolderMenu, setOpenFolderMenu] = useState<string | null>(null);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess("");
    }, 2500);
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);

    window.setTimeout(() => {
      setError("");
    }, 4000);
  }, []);

  const loadFolders = useCallback(async () => {
    try {
      const response = await fetch("/api/media/folders", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load folders.");
      }

      const data = await response.json();

      setFolders(data.folders ?? []);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to load folders.",
      );
    }
  }, [showError]);

  const loadMedia = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (typeFilter !== "all") {
        params.set("type", typeFilter);
      }

      if (selectedFolderId) {
        params.set("folderId", selectedFolderId);
      }

      const response = await fetch(`/api/media?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load media.");
      }

      const data = await response.json();

      setMedia(data.media ?? []);

      if (data.stats) {
        setStats({
          total: data.stats.total ?? 0,
          images: data.stats.images ?? 0,
          folders: data.stats.folders ?? folders.length,
          storage: data.stats.storage ?? 0,
        });
      }
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to load media.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, selectedFolderId, folders.length, showError]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const selectedFolderName =
    selectedFolderId === null
      ? "All Media"
      : folders.find((folder) => folder.id === selectedFolderId)?.name ??
        "Folder";

  const openNewFolder = () => {
    setFolderName("");
    setSelectedFolder(null);
    setModal("new-folder");
  };

  const openRenameFolder = (folder: MediaFolder) => {
    setSelectedFolder(folder);
    setFolderName(folder.name);
    setModal("rename-folder");
    setOpenFolderMenu(null);
  };

  const openMoveFolder = (folder: MediaFolder) => {
    setSelectedFolder(folder);
    setTargetFolderId(folder.parentId ?? "");
    setModal("move-folder");
    setOpenFolderMenu(null);
  };

  const openDeleteFolder = (folder: MediaFolder) => {
    setSelectedFolder(folder);
    setModal("delete-folder");
    setOpenFolderMenu(null);
  };

  const createFolder = async () => {
    const name = folderName.trim();

    if (!name) {
      showError("Please enter a folder name.");
      return;
    }

    try {
      const response = await fetch("/api/media/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          parentId: selectedFolderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create folder.");
      }

      setModal(null);
      setFolderName("");

      await loadFolders();
      showSuccess("Folder created successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to create folder.",
      );
    }
  };

  const renameFolder = async () => {
    if (!selectedFolder) return;

    const name = folderName.trim();

    if (!name) {
      showError("Please enter a folder name.");
      return;
    }

    try {
      const response = await fetch(
        `/api/media/folders/${selectedFolder.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to rename folder.");
      }

      setModal(null);
      setSelectedFolder(null);
      setFolderName("");

      await loadFolders();
      await loadMedia();

      showSuccess("Folder renamed successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to rename folder.",
      );
    }
  };

  const moveFolder = async () => {
    if (!selectedFolder) return;

    try {
      const response = await fetch(
        `/api/media/folders/${selectedFolder.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parentId: targetFolderId || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to move folder.");
      }

      setModal(null);
      setSelectedFolder(null);
      setTargetFolderId("");

      await loadFolders();

      showSuccess("Folder moved successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to move folder.",
      );
    }
  };

  const deleteFolder = async () => {
    if (!selectedFolder) return;

    try {
      const response = await fetch(
        `/api/media/folders/${selectedFolder.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete folder.");
      }

      if (selectedFolderId === selectedFolder.id) {
        setSelectedFolderId(null);
      }

      setModal(null);
      setSelectedFolder(null);

      await loadFolders();
      await loadMedia();

      showSuccess("Folder deleted successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to delete folder.",
      );
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    if (!fileArray.length) return;

    setUploading(true);

    let uploadedCount = 0;

    try {
      for (const file of fileArray) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          showError(`${file.name} is not a supported image type.`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          showError(`${file.name} is larger than 10 MB.`);
          continue;
        }

        const formData = new FormData();

        formData.append("file", file);

        if (selectedFolderId) {
          formData.append("folderId", selectedFolderId);
        }

        const response = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Unable to upload ${file.name}.`);
        }

        uploadedCount++;
      }

      if (uploadedCount > 0) {
        showSuccess(
          uploadedCount === 1
            ? "Media uploaded successfully."
            : `${uploadedCount} files uploaded successfully.`,
        );
      }

      await loadMedia();
      await loadFolders();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to upload files.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      uploadFiles(event.target.files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    if (event.dataTransfer.files.length) {
      uploadFiles(event.dataTransfer.files);
    }
  };

  const openMediaDetails = (item: MediaItem) => {
    setSelectedMedia(item);
    setEditAlt(item.alt ?? "");
    setModal("media-details");
  };

  const openMoveMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    setTargetFolderId(item.folderId ?? "");
    setModal("move-media");
  };

  const saveMediaDetails = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`/api/media/${selectedMedia.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alt: editAlt.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update media.");
      }

      setSelectedMedia(data.media ?? selectedMedia);
      setModal(null);

      await loadMedia();

      showSuccess("Media updated successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to update media.",
      );
    }
  };

  const moveMedia = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`/api/media/${selectedMedia.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderId: targetFolderId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to move media.");
      }

      setModal(null);
      setSelectedMedia(null);
      setTargetFolderId("");

      await loadMedia();
      await loadFolders();

      showSuccess("Media moved successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to move media.",
      );
    }
  };

  const deleteMedia = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`/api/media/${selectedMedia.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete media.");
      }

      setModal(null);
      setSelectedMedia(null);

      await loadMedia();
      await loadFolders();

      showSuccess("Media deleted successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to delete media.",
      );
    }
  };

  const copyMediaUrl = async (item: MediaItem) => {
    try {
      const url = `${window.location.origin}${item.url}`;

      await navigator.clipboard.writeText(url);

      showSuccess("Media URL copied.");
    } catch {
      showError("Unable to copy URL.");
    }
  };

  const downloadMedia = (item: MediaItem) => {
    const link = document.createElement("a");

    link.href = item.url;
    link.download = item.originalName;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredFolders = folders.filter((folder) => {
    if (!selectedFolderId) {
      return folder.parentId === null;
    }

    return folder.parentId === selectedFolderId;
  });

  return (
    <div className="min-h-full bg-[#FCFAF7] p-4 md:p-6">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                <ImageIcon className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
                  Media Library
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Manage images and media used throughout Lifeline Achham.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openNewFolder}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#2457C5] hover:bg-[#EEF4FF] hover:text-[#2457C5]"
            >
              <FolderPlus className="h-4 w-4" />
              New Folder
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2457C5] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17439F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Media"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Media"
            value={stats.total}
            icon={<ImageIcon className="h-5 w-5" />}
          />

          <StatCard
            label="Images"
            value={stats.images}
            icon={<FileImage className="h-5 w-5" />}
          />

          <StatCard
            label="Folders"
            value={folders.length}
            icon={<Folder className="h-5 w-5" />}
          />

          <StatCard
            label="Storage Used"
            value={formatBytes(stats.storage)}
            icon={<File className="h-5 w-5" />}
          />
        </div>

        {/* Main Library */}
        <div className="grid min-h-[650px] overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Library
                </p>

                <p className="mt-1 text-sm font-semibold text-[#172033]">
                  Folders
                </p>
              </div>

              <button
                type="button"
                onClick={openNewFolder}
                title="Create folder"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#2457C5] hover:bg-[#EEF4FF] hover:text-[#2457C5]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* All Media */}
            <div className="mb-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedFolderId(null)}
                className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                  selectedFolderId === null
                    ? "bg-[#EEF4FF] text-[#2457C5]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ImageIcon className="h-4 w-4 shrink-0" />

                <span className="truncate">
                  All Media
                </span>

                <span className="ml-auto text-xs text-slate-400">
                  {stats.total}
                </span>
              </button>

              <button
                type="button"
                onClick={openNewFolder}
                title="Create folder"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#2457C5] hover:bg-[#EEF4FF] hover:text-[#2457C5]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Folder Tree */}
            <div className="space-y-1">
              {folders
                .filter((folder) => folder.parentId === null)
                .map((folder) => (
                  <FolderTreeItem
                    key={folder.id}
                    folder={folder}
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    openFolderMenu={openFolderMenu}
                    setOpenFolderMenu={setOpenFolderMenu}
                    onSelect={(id) => setSelectedFolderId(id)}
                    onRename={openRenameFolder}
                    onMove={openMoveFolder}
                    onDelete={openDeleteFolder}
                  />
                ))}
            </div>

            {folders.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-4 text-center">
                <FolderOpen className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-2 text-xs font-medium text-slate-500">
                  No folders yet
                </p>

                <button
                  type="button"
                  onClick={openNewFolder}
                  className="mt-3 text-xs font-semibold text-[#2457C5] hover:underline"
                >
                  Create your first folder
                </button>
              </div>
            )}
          </aside>

          {/* Content */}
          <main
            className={`min-w-0 overflow-visible ${
              dragging ? "bg-[#EEF4FF]" : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {/* Toolbar */}
            <div className="border-b border-slate-200 p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-[#172033]">
                      {selectedFolderName}
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {media.length}
                    </span>

                    <button
                      type="button"
                      onClick={openNewFolder}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#2457C5] hover:bg-[#EEF4FF] hover:text-[#2457C5]"
                    >
                      <FolderPlus className="h-3.5 w-3.5" />
                      New Folder
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {selectedFolderId
                      ? `Manage media inside ${selectedFolderName}.`
                      : "Browse all uploaded media."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search media..."
                      className="input-style h-10 w-full pl-9 sm:w-[220px]"
                    />
                  </div>

                  {/* Type */}
                  <select
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(event.target.value)
                    }
                    className="input-style h-10 w-auto min-w-[120px]"
                  >
                    <option value="all">All Types</option>
                    <option value="images">Images</option>
                    <option value="other">Other</option>
                  </select>

                  {/* View */}
                  <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
                        viewMode === "grid"
                          ? "bg-white text-[#2457C5] shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                      title="Grid view"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
                        viewMode === "list"
                          ? "bg-white text-[#2457C5] shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                      title="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drop zone */}
            {dragging && (
              <div className="m-4 rounded-2xl border-2 border-dashed border-[#2457C5] bg-[#EEF4FF] px-6 py-12 text-center">
                <Upload className="mx-auto h-10 w-10 text-[#2457C5]" />

                <p className="mt-3 text-sm font-bold text-[#2457C5]">
                  Drop files to upload
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Files will be uploaded to {selectedFolderName}.
                </p>
              </div>
            )}

            {/* Media */}
            {!dragging && (
              <div className="p-4">
                {loading ? (
                  <LoadingState />
                ) : media.length === 0 ? (
                  <EmptyState
                    search={search}
                    onUpload={() => fileInputRef.current?.click()}
                    onNewFolder={openNewFolder}
                  />
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {media.map((item) => (
                      <MediaCard
                        key={item.id}
                        item={item}
                        onOpen={() => openMediaDetails(item)}
                        onMove={() => openMoveMedia(item)}
                        onDelete={() => {
                          setSelectedMedia(item);
                          setModal("delete-media");
                        }}
                        onCopy={() => copyMediaUrl(item)}
                        onDownload={() => downloadMedia(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <MediaList
                    media={media}
                    onOpen={openMediaDetails}
                    onMove={openMoveMedia}
                    onDelete={(item) => {
                      setSelectedMedia(item);
                      setModal("delete-media");
                    }}
                    onCopy={copyMediaUrl}
                    onDownload={downloadMedia}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      {modal === "new-folder" && (
        <Modal
          title="Create Folder"
          description={
            selectedFolderId
              ? `Create a new folder inside ${selectedFolderName}.`
              : "Create a new folder in the media library."
          }
          onClose={() => setModal(null)}
        >
          <input
            autoFocus
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                createFolder();
              }
            }}
            placeholder="Folder name"
            className="input-style"
          />

          <ModalActions
            onCancel={() => setModal(null)}
            onConfirm={createFolder}
            confirmLabel="Create Folder"
          />
        </Modal>
      )}

      {modal === "rename-folder" && selectedFolder && (
        <Modal
          title="Rename Folder"
          description={`Rename "${selectedFolder.name}".`}
          onClose={() => setModal(null)}
        >
          <input
            autoFocus
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                renameFolder();
              }
            }}
            className="input-style"
          />

          <ModalActions
            onCancel={() => setModal(null)}
            onConfirm={renameFolder}
            confirmLabel="Save Changes"
          />
        </Modal>
      )}

      {modal === "move-folder" && selectedFolder && (
        <Modal
          title="Move Folder"
          description={`Move "${selectedFolder.name}" to another location.`}
          onClose={() => setModal(null)}
        >
          <FolderSelect
            folders={folders}
            value={targetFolderId}
            onChange={setTargetFolderId}
            excludeId={selectedFolder.id}
          />

          <ModalActions
            onCancel={() => setModal(null)}
            onConfirm={moveFolder}
            confirmLabel="Move Folder"
          />
        </Modal>
      )}

      {modal === "delete-folder" && selectedFolder && (
        <ConfirmModal
          title="Delete Folder?"
          description={`Are you sure you want to delete "${selectedFolder.name}"? Folders containing media or subfolders cannot be deleted.`}
          confirmLabel="Delete Folder"
          danger
          onCancel={() => setModal(null)}
          onConfirm={deleteFolder}
        />
      )}

      {modal === "media-details" && selectedMedia && (
        <Modal
          title="Media Details"
          description={selectedMedia.originalName}
          onClose={() => setModal(null)}
          wide
        >
          <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {isImage(selectedMedia.mimeType) ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt || selectedMedia.originalName}
                  className="aspect-square h-full w-full object-contain"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center">
                  <File className="h-16 w-16 text-slate-300" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <DetailRow
                label="File Name"
                value={selectedMedia.originalName}
              />

              <DetailRow
                label="Type"
                value={selectedMedia.mimeType}
              />

              <DetailRow
                label="Size"
                value={formatBytes(selectedMedia.size)}
              />

              <DetailRow
                label="Folder"
                value={selectedMedia.folder?.name ?? "All Media"}
              />

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Alt Text
                </label>

                <input
                  value={editAlt}
                  onChange={(event) => setEditAlt(event.target.value)}
                  placeholder="Describe this image for accessibility"
                  className="input-style"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveMediaDetails}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2457C5] px-4 text-sm font-semibold text-white transition hover:bg-[#17439F]"
                >
                  <Check className="h-4 w-4" />
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => copyMediaUrl(selectedMedia)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Clipboard className="h-4 w-4" />
                  Copy URL
                </button>

                <button
                  type="button"
                  onClick={() => downloadMedia(selectedMedia)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {modal === "move-media" && selectedMedia && (
        <Modal
          title="Move Media"
          description={`Move "${selectedMedia.originalName}" to another folder.`}
          onClose={() => setModal(null)}
        >
          <FolderSelect
            folders={folders}
            value={targetFolderId}
            onChange={setTargetFolderId}
          />

          <ModalActions
            onCancel={() => setModal(null)}
            onConfirm={moveMedia}
            confirmLabel="Move Media"
          />
        </Modal>
      )}

      {modal === "delete-media" && selectedMedia && (
        <ConfirmModal
          title="Delete Media?"
          description={`This will permanently delete "${selectedMedia.originalName}". This action cannot be undone.`}
          confirmLabel="Delete Media"
          danger
          onCancel={() => setModal(null)}
          onConfirm={deleteMedia}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-[#172033]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function FolderTreeItem({
  folder,
  folders,
  selectedFolderId,
  openFolderMenu,
  setOpenFolderMenu,
  onSelect,
  onRename,
  onMove,
  onDelete,
  level = 0,
}: {
  folder: MediaFolder;
  folders: MediaFolder[];
  selectedFolderId: string | null;
  openFolderMenu: string | null;
  setOpenFolderMenu: (id: string | null) => void;
  onSelect: (id: string) => void;
  onRename: (folder: MediaFolder) => void;
  onMove: (folder: MediaFolder) => void;
  onDelete: (folder: MediaFolder) => void;
  level?: number;
}) {
  const children = folders.filter(
    (child) => child.parentId === folder.id,
  );

  const active = selectedFolderId === folder.id;
  const menuOpen = openFolderMenu === folder.id;

  return (
    <div className="relative">
      <div
        className={`group flex items-center gap-1 rounded-lg transition ${
          active
            ? "bg-[#EEF4FF] text-[#2457C5]"
            : "text-slate-600 hover:bg-slate-50"
        }`}
        style={{
          paddingLeft: `${8 + level * 16}px`,
        }}
      >
        <button
          type="button"
          onClick={() => onSelect(folder.id)}
          className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left"
        >
          {active ? (
            <FolderOpen className="h-4 w-4 shrink-0" />
          ) : (
            <Folder className="h-4 w-4 shrink-0" />
          )}

          <span className="truncate text-sm font-medium">
            {folder.name}
          </span>

          <span className="ml-auto shrink-0 text-[11px] text-slate-400">
            {folder._count?.media ?? 0}
          </span>
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setOpenFolderMenu(menuOpen ? null : folder.id);
          }}
          className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-0 transition hover:bg-white hover:text-slate-600 group-hover:opacity-100"
          title="Folder actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-1 top-9 z-[100] w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => onRename(folder)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Rename
            </button>

            <button
              type="button"
              onClick={() => onMove(folder)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Folder className="h-3.5 w-3.5" />
              Move
            </button>

            <button
              type="button"
              onClick={() => onDelete(folder)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div className="mt-1 space-y-1">
          {children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              folders={folders}
              selectedFolderId={selectedFolderId}
              openFolderMenu={openFolderMenu}
              setOpenFolderMenu={setOpenFolderMenu}
              onSelect={onSelect}
              onRename={onRename}
              onMove={onMove}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({
  item,
  onOpen,
  onMove,
  onDelete,
  onCopy,
  onDownload,
}: {
  item: MediaItem;
  onOpen: () => void;
  onMove: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="group relative min-w-0 overflow-visible rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden rounded-t-xl text-left"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {isImage(item.mimeType) ? (
            <img
              src={item.url}
              alt={item.alt || item.originalName}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <File className="h-12 w-12 text-slate-300" />
            </div>
          )}

          <div className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm backdrop-blur">
            {item.mimeType.split("/")[1] || "FILE"}
          </div>
        </div>
      </button>

      <div className="p-3">
        <button
          type="button"
          onClick={onOpen}
          className="block w-full min-w-0 text-left"
        >
          <p
            className="truncate text-sm font-semibold text-slate-700"
            title={item.originalName}
          >
            {item.originalName}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatBytes(item.size)}
          </p>
        </button>

        {item.folder && (
          <div className="mt-2 flex min-w-0 items-center gap-1 text-[11px] text-slate-400">
            <Folder className="h-3 w-3 shrink-0" />

            <span
              className="truncate"
              title={item.folder.name}
            >
              {item.folder.name}
            </span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-2">
          <CardAction
            icon={<Pencil className="h-3.5 w-3.5" />}
            label="Edit"
            onClick={onOpen}
          />

          <CardAction
            icon={<Folder className="h-3.5 w-3.5" />}
            label="Move"
            onClick={onMove}
          />

          <CardAction
            icon={<Clipboard className="h-3.5 w-3.5" />}
            label="Copy URL"
            onClick={onCopy}
          />

          <CardAction
            icon={<Download className="h-3.5 w-3.5" />}
            label="Download"
            onClick={onDownload}
          />

          <CardAction
            icon={<Trash2 className="h-3.5 w-3.5" />}
            label="Delete"
            danger
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}

function CardAction({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex h-8 min-w-0 flex-1 items-center justify-center rounded-lg transition ${
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-[#EEF4FF] hover:text-[#2457C5]"
      }`}
    >
      {icon}
    </button>
  );
}

function MediaList({
  media,
  onOpen,
  onMove,
  onDelete,
  onCopy,
  onDownload,
}: {
  media: MediaItem[];
  onOpen: (item: MediaItem) => void;
  onMove: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
  onCopy: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
}) {
  return (
    <div className="overflow-visible rounded-xl border border-slate-200">
      <div className="hidden grid-cols-[minmax(0,1fr)_140px_120px_180px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
        <span>File</span>
        <span>Type</span>
        <span>Size</span>
        <span>Actions</span>
      </div>

      {media.map((item) => (
        <div
          key={item.id}
          className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_140px_120px_180px] md:items-center md:gap-4"
        >
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
              {isImage(item.mimeType) ? (
                <img
                  src={item.url}
                  alt={item.alt || item.originalName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <File className="h-6 w-6 text-slate-300" />
              )}
            </div>

            <div className="min-w-0">
              <p
                className="truncate text-sm font-semibold text-slate-700"
                title={item.originalName}
              >
                {item.originalName}
              </p>

              <p className="mt-1 truncate text-xs text-slate-400">
                {item.folder?.name ?? "All Media"}
              </p>
            </div>
          </button>

          <span className="text-xs text-slate-500">
            {item.mimeType}
          </span>

          <span className="text-xs text-slate-500">
            {formatBytes(item.size)}
          </span>

          <div className="flex items-center gap-1">
            <CardAction
              icon={<Pencil className="h-3.5 w-3.5" />}
              label="Edit"
              onClick={() => onOpen(item)}
            />

            <CardAction
              icon={<Folder className="h-3.5 w-3.5" />}
              label="Move"
              onClick={() => onMove(item)}
            />

            <CardAction
              icon={<Clipboard className="h-3.5 w-3.5" />}
              label="Copy URL"
              onClick={() => onCopy(item)}
            />

            <CardAction
              icon={<Download className="h-3.5 w-3.5" />}
              label="Download"
              onClick={() => onDownload(item)}
            />

            <CardAction
              icon={<Trash2 className="h-3.5 w-3.5" />}
              label="Delete"
              danger
              onClick={() => onDelete(item)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  search,
  onUpload,
  onNewFolder,
}: {
  search: string;
  onUpload: () => void;
  onNewFolder: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
        <ImageIcon className="h-8 w-8" />
      </div>

      <h3 className="mt-5 text-base font-bold text-[#172033]">
        {search ? "No media found" : "Your media library is empty"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {search
          ? "Try changing your search or filter."
          : "Upload images or create a folder to start organizing your media."}
      </p>

      {!search && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onUpload}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2457C5] px-4 text-sm font-semibold text-white hover:bg-[#17439F]"
          >
            <Upload className="h-4 w-4" />
            Upload Media
          </button>

          <button
            type="button"
            onClick={onNewFolder}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <div className="aspect-square animate-pulse bg-slate-100" />

          <div className="space-y-2 p-3">
            <div className="h-4 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Modal({
  title,
  description,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-md"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-bold text-[#172033]">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  description,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title={title} description={description} onClose={onCancel}>
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

        <p className="text-xs leading-5 text-amber-800">
          Please make sure you want to continue. This action may not be
          reversible.
        </p>
      </div>

      <ModalActions
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmLabel={confirmLabel}
        danger={danger}
      />
    </Modal>
  );
}

function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel,
  danger = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  danger?: boolean;
}) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onConfirm}
        className={`h-10 rounded-lg px-4 text-sm font-semibold text-white transition ${
          danger
            ? "bg-red-600 hover:bg-red-700"
            : "bg-[#2457C5] hover:bg-[#17439F]"
        }`}
      >
        {confirmLabel}
      </button>
    </div>
  );
}

function FolderSelect({
  folders,
  value,
  onChange,
  excludeId,
}: {
  folders: MediaFolder[];
  value: string;
  onChange: (value: string) => void;
  excludeId?: string;
}) {
  const availableFolders = folders.filter(
    (folder) => folder.id !== excludeId,
  );

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="input-style"
    >
      <option value="">All Media / Root</option>

      {availableFolders.map((folder) => (
        <option key={folder.id} value={folder.id}>
          {getFolderPath(folder, folders)}
        </option>
      ))}
    </select>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getFolderPath(
  folder: MediaFolder,
  folders: MediaFolder[],
): string {
  const path: string[] = [folder.name];

  let parentId = folder.parentId;

  while (parentId) {
    const parent = folders.find((item) => item.id === parentId);

    if (!parent) break;

    path.unshift(parent.name);

    parentId = parent.parentId;
  }

  return path.join(" / ");
}