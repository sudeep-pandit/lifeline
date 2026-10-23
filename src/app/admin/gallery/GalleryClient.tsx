
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Images,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type MediaItem = {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
};

type GalleryPhoto = {
  id: string;
  title: string;
  albumId: string;
  mediaId: string;
  sortOrder: number;
  media: MediaItem;
};

type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  year: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
  coverMediaId: string | null;
  coverMedia: MediaItem | null;
  photos: GalleryPhoto[];
  _count: {
    photos: number;
  };
};

type AlbumForm = {
  title: string;
  slug: string;
  description: string;
  category: string;
  year: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: string;
  coverMediaId: string;
};

const EMPTY_FORM: AlbumForm = {
  title: "",
  slug: "",
  description: "",
  category: "Events",
  year: "2083",
  status: "DRAFT",
  sortOrder: "0",
  coverMediaId: "",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#2457C5] focus:ring-4 focus:ring-blue-100";

export default function GalleryClient() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [form, setForm] = useState<AlbumForm>({ ...EMPTY_FORM });

  const [photoAlbum, setPhotoAlbum] = useState<Album | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [mediaSearch, setMediaSearch] = useState("");

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/gallery", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load gallery albums.");
      }

      setAlbums(data.albums ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load gallery albums.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMedia = useCallback(async () => {
    try {
      const response = await fetch("/api/media?type=images", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load media library.");
      }

      setMedia(
        (data.media ?? []).filter(
          (item: MediaItem) => item.mimeType?.startsWith("image/"),
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load media library.",
      );
    }
  }, []);

  useEffect(() => {
    void loadAlbums();
    void loadMedia();
  }, [loadAlbums, loadMedia]);

  function showMessage(message: string) {
    setNotice(message);
    setError("");
  }

  function showError(message: string) {
    setError(message);
    setNotice("");
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setEditorOpen(true);
    setError("");
    setNotice("");
  }

  function openEdit(album: Album) {
    setEditing(album);

    setForm({
      title: album.title,
      slug: album.slug,
      description: album.description ?? "",
      category: album.category,
      year: album.year,
      status: album.status,
      sortOrder: String(album.sortOrder),
      coverMediaId: album.coverMediaId ?? "",
    });

    setEditorOpen(true);
    setError("");
    setNotice("");
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  function updateForm<K extends keyof AlbumForm>(
    key: K,
    value: AlbumForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveAlbum(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const endpoint = editing
        ? `/api/gallery/${editing.id}`
        : "/api/gallery";

      const response = await fetch(endpoint, {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          category: form.category.trim(),
          year: form.year.trim(),
          status: form.status,
          sortOrder: Number(form.sortOrder),
          coverMediaId: form.coverMediaId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save gallery album.");
      }

      closeEditor();
      await loadAlbums();
      showMessage(data.message || "Gallery album saved successfully.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to save gallery album.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteAlbum(album: Album) {
    const confirmed = window.confirm(
      `Delete "${album.title}"?\n\nIts album and photo associations will be deleted. Original media files will remain in Media Management.`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/gallery/${album.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete album.");
      }

      if (photoAlbum?.id === album.id) {
        setPhotoAlbum(null);
      }

      await loadAlbums();
      showMessage(data.message || "Gallery album deleted.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to delete gallery album.",
      );
    }
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      showError("Please select an image file.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("alt", file.name.replace(/\.[^.]+$/, ""));

      const response = await fetch("/api/media", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      await loadMedia();

      const uploadedMediaId = data.media?.id;

      if (uploadedMediaId) {
        setForm((current) => ({
          ...current,
          coverMediaId: uploadedMediaId,
        }));

        setSelectedMedia((current) =>
          current.includes(uploadedMediaId)
            ? current
            : [...current, uploadedMediaId],
        );
      }

      showMessage("Image uploaded successfully.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function openPhotos(album: Album) {
    setError("");
    setNotice("");
    setSelectedMedia([]);
    setMediaSearch("");

    try {
      const response = await fetch("/api/gallery", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load album photos.");
      }

      const freshAlbum = (data.albums as Album[]).find(
        (item) => item.id === album.id,
      );

      setPhotoAlbum(freshAlbum ?? album);
      await loadMedia();
    } catch (err) {
      setPhotoAlbum(album);
      showError(
        err instanceof Error ? err.message : "Unable to load album photos.",
      );
    }
  }

  async function addPhotos() {
    if (!photoAlbum || selectedMedia.length === 0) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/gallery/${photoAlbum.id}/photos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaIds: selectedMedia,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to add photos.");
      }

      setSelectedMedia([]);
      await loadAlbums();

      const refreshedResponse = await fetch("/api/gallery", {
        cache: "no-store",
      });
      const refreshedData = await refreshedResponse.json();

      const refreshedAlbum = (refreshedData.albums as Album[]).find(
        (item) => item.id === photoAlbum.id,
      );

      if (refreshedAlbum) {
        setPhotoAlbum(refreshedAlbum);
      }

      showMessage(data.message || "Photos added to the album.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to add photos.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removePhoto(photo: GalleryPhoto) {
    if (!photoAlbum) return;

    const confirmed = window.confirm(
      "Remove this photo from the album? The original media file will remain.",
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/gallery/${photoAlbum.id}/photos`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoId: photo.id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to remove photo.");
      }

      const refreshedResponse = await fetch("/api/gallery", {
        cache: "no-store",
      });

      const refreshedData = await refreshedResponse.json();

      const refreshedAlbum = (refreshedData.albums as Album[]).find(
        (item) => item.id === photoAlbum.id,
      );

      if (refreshedAlbum) {
        setPhotoAlbum(refreshedAlbum);
      }

      setAlbums(refreshedData.albums ?? []);
      showMessage(data.message || "Photo removed from album.");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Unable to remove photo.",
      );
    }
  }

  const filteredAlbums = albums.filter((album) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      album.title.toLowerCase().includes(query) ||
      album.category.toLowerCase().includes(query) ||
      album.year.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" || album.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredMedia = media.filter((item) => {
    const query = mediaSearch.trim().toLowerCase();

    return (
      !query ||
      item.originalName.toLowerCase().includes(query) ||
      (item.alt ?? "").toLowerCase().includes(query)
    );
  });

  const publishedCount = albums.filter(
    (album) => album.status === "PUBLISHED",
  ).length;

  const totalPhotos = albums.reduce(
    (total, album) => total + album._count.photos,
    0,
  );

  return (
    <main className="min-h-screen space-y-6 bg-[#FCFAF7] p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#2457C5]">
            <Images className="h-4 w-4" />
            Content Management
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            Gallery Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage albums, event photographs, and community memories.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              void loadAlbums();
              void loadMedia();
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2457C5] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#17439F]"
          >
            <Plus className="h-4 w-4" />
            New Album
          </button>
        </div>
      </header>

      {error && (
        <AlertBanner
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}

      {notice && (
        <AlertBanner
          message={notice}
          type="success"
          onClose={() => setNotice("")}
        />
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Albums"
          value={albums.length}
          icon={<Images className="h-6 w-6" />}
        />

        <StatCard
          label="Published Albums"
          value={publishedCount}
          icon={<CheckCircle2 className="h-6 w-6" />}
        />

        <StatCard
          label="Photos in Albums"
          value={totalPhotos}
          icon={<ImageIcon className="h-6 w-6" />}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search albums by title, category, or year..."
              className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#2457C5] focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#2457C5]"
          >
            <option value="ALL">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading gallery albums...
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2457C5]">
              <Images className="h-7 w-7" />
            </div>

            <h2 className="mt-4 font-bold text-[#172033]">
              {search || statusFilter !== "ALL"
                ? "No matching albums"
                : "No gallery albums yet"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create an album to organize your photographs.
            </p>

            {!search && statusFilter === "ALL" && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2457C5] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Create First Album
              </button>
            )}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAlbums.map((album) => {
              const cover =
                album.coverMedia?.url || album.photos[0]?.media.url || "";

              return (
                <article
                  key={album.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={album.coverMedia?.alt || album.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}

                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${
                        album.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {album.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>

                    <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white">
                      {album._count.photos} photos
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-[#172033]">
                          {album.title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {album.category} · {album.year}
                        </p>
                      </div>

                      <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-[#2457C5]">
                        #{album.sortOrder}
                      </span>
                    </div>

                    {album.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
                        {album.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => void openPhotos(album)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-xs font-bold text-[#2457C5] hover:bg-blue-100"
                      >
                        <Images className="h-3.5 w-3.5" />
                        Manage Photos
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(album)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteAlbum(album)}
                        className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-100 px-3 text-xs font-bold text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${album.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <AlbumEditor
        open={editorOpen}
        editing={editing}
        media={media}
        form={form}
        saving={saving}
        uploading={uploading}
        onClose={closeEditor}
        onChange={updateForm}
        onSubmit={saveAlbum}
        onUpload={uploadImage}
      />

      {photoAlbum && (
        <Modal
          title={`Manage Photos — ${photoAlbum.title}`}
          subtitle="Select images from your media library and add them to this album."
          onClose={() => setPhotoAlbum(null)}
          wide
        >
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={mediaSearch}
                  onChange={(event) => setMediaSearch(event.target.value)}
                  placeholder="Search your image library..."
                  className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#2457C5]"
                />
              </div>

              <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                {uploading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {uploading ? "Uploading..." : "Upload Image"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadImage(file);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
              {filteredMedia.map((item) => {
                const checked = selectedMedia.includes(item.id);

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setSelectedMedia((current) =>
                        checked
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id],
                      )
                    }
                    className={`overflow-hidden rounded-xl border-2 text-left transition ${
                      checked
                        ? "border-[#2457C5] bg-blue-50"
                        : "border-slate-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="relative aspect-square bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.alt || item.originalName}
                        className="h-full w-full object-cover"
                      />

                      {checked && (
                        <span className="absolute right-2 top-2 rounded-full bg-[#2457C5] p-1 text-white">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                      )}
                    </div>

                    <p className="truncate p-2 text-xs font-medium text-slate-600">
                      {item.originalName}
                    </p>
                  </button>
                );
              })}
            </div>

            {filteredMedia.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                No images found. Upload an image or check Media Management.
              </p>
            )}

            <div>
              <h3 className="mb-3 text-sm font-bold text-[#172033]">
                Photos in this album ({photoAlbum.photos.length})
              </h3>

              {photoAlbum.photos.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  This album does not contain any photos yet.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {photoAlbum.photos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.media.url}
                        alt={photo.media.alt || photo.media.originalName}
                        className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => void removePhoto(photo)}
                        title="Remove from album"
                        className="absolute right-1 top-1 rounded-lg bg-white/95 p-1.5 text-red-600 shadow hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                {selectedMedia.length} image(s) selected
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoAlbum(null)}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => void addPhotos()}
                  disabled={saving || selectedMedia.length === 0}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2457C5] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}
                  Add Selected Photos
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function AlertBanner({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "error" | "success";
  onClose: () => void;
}) {
  const success = type === "success";

  return (
    <div
      className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
        success
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}

      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="ml-auto"
        aria-label="Dismiss message"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2457C5]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-[#172033]">
          {value}
        </p>
      </div>
    </div>
  );
}

function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${
          wide ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5">
          <div>
            <h2 className="text-lg font-bold text-[#172033]">{title}</h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

function AlbumEditor({
  open,
  editing,
  media,
  form,
  saving,
  uploading,
  onClose,
  onChange,
  onSubmit,
  onUpload,
}: {
  open: boolean;
  editing: Album | null;
  media: MediaItem[];
  form: AlbumForm;
  saving: boolean;
  uploading: boolean;
  onClose: () => void;
  onChange: <K extends keyof AlbumForm>(
    key: K,
    value: AlbumForm[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpload: (file: File) => Promise<void>;
}) {
  if (!open) return null;

  const selectedCover = media.find(
    (item) => item.id === form.coverMediaId,
  );

  return (
    <Modal
      title={editing ? "Edit Gallery Album" : "Create Gallery Album"}
      subtitle="Set up the album details, cover image, and publication status."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Album Title *
          </label>

          <input
            required
            maxLength={160}
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            className={inputClass}
            placeholder="e.g. Community Health Camp"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Slug (optional)
          </label>

          <input
            value={form.slug}
            onChange={(event) => onChange("slug", event.target.value)}
            className={inputClass}
            placeholder="community-health-camp"
          />

          <p className="mt-1 text-xs text-slate-400">
            Leave blank to generate a slug from the title.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Category *
            </label>

            <input
              required
              maxLength={80}
              value={form.category}
              onChange={(event) => onChange("category", event.target.value)}
              className={inputClass}
              placeholder="Events, Campaigns, Programs..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Year *
            </label>

            <input
              required
              maxLength={20}
              value={form.year}
              onChange={(event) => onChange("year", event.target.value)}
              className={inputClass}
              placeholder="2083"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Description
          </label>

          <textarea
            rows={3}
            maxLength={5000}
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            className={inputClass}
            placeholder="Describe the event or collection..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-700">
              Cover Image
            </label>

            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#2457C5]">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading..." : "Upload Image"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onUpload(file);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          </div>

          <select
            value={form.coverMediaId}
            onChange={(event) =>
              onChange("coverMediaId", event.target.value)
            }
            className={inputClass}
          >
            <option value="">Use first album photo / no cover</option>

            {media.map((item) => (
              <option key={item.id} value={item.id}>
                {item.originalName}
              </option>
            ))}
          </select>

          {selectedCover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedCover.url}
              alt={selectedCover.alt || "Selected cover preview"}
              className="mt-3 aspect-[16/7] max-h-40 w-full rounded-xl object-cover"
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Publication Status
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                onChange(
                  "status",
                  event.target.value as AlbumForm["status"],
                )
              }
              className={inputClass}
            >
              <option value="DRAFT">Draft — hidden from public gallery</option>
              <option value="PUBLISHED">Published — visible publicly</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Display Order
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.sortOrder}
              onChange={(event) => onChange("sortOrder", event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2457C5] px-4 text-sm font-semibold text-white hover:bg-[#17439F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {editing ? "Save Changes" : "Create Album"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
