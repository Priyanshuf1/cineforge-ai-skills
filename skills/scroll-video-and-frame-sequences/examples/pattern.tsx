// Canvas frame drawing logic
export const drawFrame = (ctx, img) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(img, 0, 0);
};
