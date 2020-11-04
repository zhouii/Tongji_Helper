// 要加载的模型路径
// 模型设计与训练由 @supermassiveasshole 完成
const MODEL_PATH = chrome.runtime.getURL('js/captcha/model/model.json');
const CLASSES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
// 每张验证码含有的字母数量
const DIGIT_COUNT = 4
let singleDigitHeight = 69
let singleDigitWidth = 50

async function processAndPredict(base64Data) {
    return predictBase64(base64Data);
}

async function loadModel(path) {
    return tf.loadLayersModel(path);
}

// 均分成4张图片
function splitImageTo4Parts(img) {
    singleDigitWidth = img.bitmap.width / DIGIT_COUNT;
    singleDigitHeight = img.bitmap.height;
    const single_digit_y = 0;

    let i0 = img.clone();
    i0.crop(0, single_digit_y, singleDigitWidth, singleDigitHeight);
    let i1 = img.clone();
    i1.crop(singleDigitWidth, single_digit_y, singleDigitWidth, singleDigitHeight);
    let i2 = img.clone();
    i2.crop(singleDigitWidth * 2, single_digit_y, singleDigitWidth, singleDigitHeight);
    let i3 = img.clone();
    i3.crop(singleDigitWidth * 3, single_digit_y, singleDigitWidth, singleDigitHeight);

    return [i0, i1, i2, i3];
}

// 将单个数字图片转换成扁平的二值化数组
function decodeImageToTypedArray(images, files_typed_array) {
    for (let i = 0; i < images.length; i++) {
        files_typed_array.push(binariesImage(extractPixel(images[i].bitmap.data)));
    }
}

// 提取像素到矩阵
function extractPixel(typed_array) {
    if (typed_array.length % 4 !== 0) {
        // console.log(typed_array);
        throw 'Pixel Not In RGBA Format';
    }
    let pixels = [];
    for (let i = 0; i < typed_array.length; i = i + 4) {
        let pixel = [typed_array[i], typed_array[i + 1], typed_array[i + 2], typed_array[i + 3]];
        pixels.push(pixel);
    }
    return pixels;
}

// 二值化，转换成黑白
function binariesImage(pixels) {
    // 敏感度越高，淡色的字母越容易被检测出来，相应的噪点也会增多
    const SENSE = 225;
    for (let i = 0; i < pixels.length; i++) {
        if (pixels[i][1] * 0.21 + pixels[i][2] * 0.71 + pixels[i][3] * 0.07 > SENSE)
            pixels[i] = 1;
        else
            pixels[i] = 0;
    }
    return pixels;
}

async function predictBase64(base64Data) {
    return new Promise(resolve => {
        // 去除前缀后由jimp处理
        Jimp.read(Buffer.from(base64Data.substring("data:image/jpg;base64,".length, base64Data.length), 'base64'))
            .then(image => {
                let _imgs = splitImageTo4Parts(image);
                let files_typed_array = [];
                decodeImageToTypedArray(_imgs, files_typed_array);

                loadModel(MODEL_PATH).then(model => {
                    // console.log("model load done");
                    let tensor = tf.tensor(files_typed_array);
                    let result = model.predict(tensor.reshape([DIGIT_COUNT, singleDigitHeight, singleDigitWidth, 1])).argMax(-1).arraySync();
                    // 类别下标转换为对应字母/数字
                    let resultChs = result.map(r => CLASSES[r]);
                    // console.log(resultChs);
                    resolve(resultChs.join(""));
                })
            })
            .catch(error => {
                console.log("error in base64: " + base64Data);
                console.error(error);
            })
    });

}

