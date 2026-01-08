export function canvasToBlob(
    canvas: HTMLCanvasElement,
    type = 'image/png',
    quality?: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => {
                if (!blob) {
                    reject(new Error('canvas toBlob failed'))
                    return
                }
                resolve(blob)
            },
            type,
            quality
        )
    })
}
