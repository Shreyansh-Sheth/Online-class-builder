export function checkStringArr(...a: any) {
  for (let i of a) {
    if (typeof i !== "string") {
      throw new Error("Not An String Found " + typeof i);
    }
  }
}
