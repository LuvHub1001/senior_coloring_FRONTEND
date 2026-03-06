import type { Design } from "@/types/DesignType";

export type ArtworkStatus = "IN_PROGRESS" | "COMPLETED";

export interface Artwork {
  id: string;
  userId: string;
  designId: number;
  imageUrl: string | null;
  progress: number;
  status: ArtworkStatus;
  createdAt: string;
  updatedAt: string;
  design: Pick<Design, "id" | "title" | "imageUrl">;
}

export interface ArtworkResponse {
  success: boolean;
  data: Artwork;
}

export interface ArtworkListResponse {
  success: boolean;
  data: Artwork[];
}

export interface ArtworkDeleteResponse {
  success: boolean;
  data: null;
}
