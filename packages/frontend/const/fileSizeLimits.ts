function MBtoB(size: number) {
  return 1024 * 1024 * size;
}
const FileSizeLimits = {
  SITE_LOGO_LIMIT: MBtoB(5),
  SITE_IMAGES_LIMIT: MBtoB(5),
  DOWNLOADABLE_LIMIT: MBtoB(50),
};
export default FileSizeLimits;
