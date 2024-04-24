const dateMap: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
};

//提取出数字的月份和日期
function stringToDate(str: string) {
    let result = str.split(/月|日/);
    let mouthChinese = result[0];
    let dayChinese = result[1];
    let mouthDigit = 0;
    let dayDigit = 0;

    for (let i of mouthChinese) {
        mouthDigit += dateMap[i];
    }

    for (let i = 0; i < dayChinese.length; i++) {
        if (dayChinese[i] === "十") {
            if (i - 1 >= 0) {
                //减去之前错误的值
                dayDigit -= dateMap[dayChinese[i - 1]];
                //然后加上正确的值
                dayDigit += dateMap[dayChinese[i - 1]] * 10;
                //然后进入下一循环
                continue;
            }
        }
        dayDigit += dateMap[dayChinese[i]];
    }

    return {
        mouth: mouthDigit,
        day: dayDigit,
    };
}

//接收原始字符串，提取出其中的日期部分，返回对应Date对象，格式为"YYYY-MM-DD HH-MM-SS"
export function praseRawTodo(rawTodo: string): Date {
    let date = rawTodo.match(
        /^[一二三四五六七八九十]+月[一二三四五六七八九十]+日/,
    );
    if (date !== null) {
        let { mouth, day } = stringToDate(date[0]);
        //返回当前年份+提取月份+提取日的时间戳
        let now = new Date();
        let year = now.getFullYear();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let prasedDate = new Date(year, mouth, day, hours, minutes);
        return prasedDate;
    }
    //如果没有提取到日期，就返回当前日期
    return new Date();
}
