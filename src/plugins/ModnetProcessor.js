import { AutoModel, AutoProcessor, RawImage } from '@xenova/transformers'

// 缓存模型和处理器，避免重复加载
let model = null
let processor = null

/**
 * 使用 MODNet 模型处理本地图片
 * @param {File|Blob} file 用户上传的本地文件
 * @returns {Promise<Blob>} 返回 PNG Blob
 */
export async function processPortrait(file) {
  if (!model || !processor) {
    model = await AutoModel.from_pretrained('Xenova/modnet', { quantized: false })
    processor = await AutoProcessor.from_pretrained('Xenova/modnet')
  }

  const image = await RawImage.fromBlob(file)
  const { pixel_values } = await processor(image)
  const { output } = await model({ input: pixel_values })

  const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height)
  //return await mask.toBlob();

  console.log(image instanceof RawImage);

  // // 获取原图像素和掩码像素
  const rgb = typeof image.getImageData === 'function' ? await image.getImageData() : image.data;
  const alpha = typeof mask.getImageData === 'function' ? await mask.getImageData() : mask.data;


  const rgba = new Uint8ClampedArray(image.width * image.height * 4);

  for (let i = 0; i < image.width * image.height; i++) {
    rgba[i * 4 + 0] = rgb[i * 3 + 0]; // R
    rgba[i * 4 + 1] = rgb[i * 3 + 1]; // G
    rgba[i * 4 + 2] = rgb[i * 3 + 2]; // B
    rgba[i * 4 + 3] = alpha[i];       // A
  }

  // ✅ 创建 ImageData，绘制到 Canvas，导出 Blob
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(new ImageData(rgba, image.width, image.height), 0, 0);

  // ✅ 直接导出为 PNG Blob（带透明背景）
  return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}
