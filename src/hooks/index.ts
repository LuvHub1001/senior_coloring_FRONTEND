// Custom Hooks를 여기서 barrel export
import { useImageCarousel } from "@/hooks/useImageCarousel";
import { useHomePage } from "@/hooks/useHomePage";
import { useColoringBookPage } from "@/hooks/useColoringBookPage";
import { useColoringPlayPage } from "@/hooks/useColoringPlayPage";
import { useLoginPage } from "@/hooks/useLoginPage";
import { useAuthCallbackPage } from "@/hooks/useAuthCallbackPage";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDesignList, useDesignDetail, useDesignCategories, useCreateDesign } from "@/hooks/useDesigns";
import { useColoringCanvas } from "@/hooks/useColoringCanvas";

import { useArtworkSave } from "@/hooks/useArtworkSave";
import { useCompletionPage } from "@/hooks/useCompletionPage";
import { useLogout } from "@/hooks/useLogout";
import { useArtworkDetail } from "@/hooks/useArtworkDetail";

export {
  useImageCarousel,
  useHomePage,
  useColoringBookPage,
  useColoringPlayPage,
  useLoginPage,
  useAuthCallbackPage,
  useUserProfile,
  useDesignList,
  useDesignDetail,
  useDesignCategories,
  useCreateDesign,
  useColoringCanvas,

  useArtworkSave,
  useCompletionPage,
  useLogout,
  useArtworkDetail,
};
