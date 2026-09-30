// Originals verified during the September 2026 launch audit. These files were not
// copied to the new storage project; retain their working public source.
const originalAssetPaths = new Set([
  "recent-work-placeholder.jpg",
  "blog/747d65fe-d8ca-44eb-8d05-34a4613397a2.jpg",
  "blog/d07cc815-886e-4dad-b5c6-f9c1f70fd97d.jpg",
  "blog/f4360d77-8a3c-430d-a179-83ed90346845.jpg",
  "blog/95c7163e-37b8-4475-bd2b-1ca63740f8ab.jpg",
  "blog/a050b716-e6da-4d81-bd42-baf0d2c05611.jpg",
  "blog/c1801cc5-34b4-4e14-9a58-c112b4c1a9d6.jpg",
  "blog/56e23ed6-cd71-43d8-b001-f4f8ac40b0f7.jpg",
  "blog/f906d783-5a8e-4f7a-b3de-df75f24f2a7e.jpg",
  "blog/48c78a92-1c50-4c6b-ad6e-78d83b10ab7b.jpg",
  "blog/7314f940-0c1f-402e-b556-4599f53d2512.jpg",
  "blog/c11feb0f-8efa-4b55-b04b-ff06d2fd0e31.jpg",
  "blog/746fdc5d-e7d2-401f-b8dd-b280d3fb4354.jpg",
  "blog/ecc9d57e-5bf1-4479-be6c-a69074ebe30b.jpg",
  "blog/684603f2-4ffe-4ed0-bc62-44741e43643e.jpg",
  "blog/a65a55f7-5227-40a9-8658-16cf10be97e5.jpg",
  "blog/a85f212d-42a8-4230-8741-02a5a73a075e.jpg",
  "blog/60ad0e94-4ea4-4777-811f-e09eb4a70c63.jpg",
  "blog/552cefe0-4d53-40dc-908c-9c74d795b011.png",
  "blog/14e1b6d2-f101-41f5-b43a-ce96eb143656.jpg",
  "blog/1533b0c4-86ea-4722-8933-8db60ad598c6.jpg",
  "blog/72bf3f0e-40f8-409a-970f-5d3ebace4341.jpg"
]);
export function repairLegacyImageUrl(url: string): string {
  const prefix = "https://evgvbvvpiculuizvvqyh.supabase.co/storage/v1/object/public/company-assets/";
  if (url.startsWith(prefix) && originalAssetPaths.has(url.slice(prefix.length))) {
    return url.replace("evgvbvvpiculuizvvqyh.supabase.co", "uwalzdrmowrciwnbetzk.supabase.co");
  }
  return url.replace(/^https?:\/\/(?:www\.)?mobilitystation\.co\.uk\/cdn\/shop\//, "https://cdn.shopify.com/s/files/1/0568/2928/0435/");
}
export function repairLegacyImageHtml(html: string): string {
  return html.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi, (_, before, url, after) => before + repairLegacyImageUrl(url) + after);
}
