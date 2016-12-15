# aws-lambda-wkhtmltopdf
Convert HTML to images using Webkit (QtWebKit) on AWS Lambda

## Creating function under your AWS account

1. Log into your AWS account
2. Under Lambda, click **Create a Lambda function** button
3. When being asked to select blueprint, do not select any and click **Skip** button instead
4. Do not configure any triggers and simply click **Next** button
5. Enter name of your function (e.g. "html-to-image"), then select runtime **Node.js 4.3**
6. In **Code entry type** change **Edit code inline** to **Upload a .ZIP file**
7. Click **Upload** button to upload [this project as zip archive](https://github.com/tonydemark/aws-lambda-wkhtmltoimage/releases/download/0.1/wkhtmltoimage.zip).
8. Select **lambda_basic_execution** role (this function doesn't need access to any part of your AWS account)
9. Increase timeout from 3 seconds to 10 seconds or more.
10. Click **Next** button
11. Review your configuration and click **Create function** button

## Testing function

Click **Actions** button, then click **Configure test event** and paste following json input:

```json
{
    "html_base64" : "PGJvZHk+SGVsbG8gd29ybGQ8L2JvZHk+",
	"options":
	{
		"format": "jpg"
	}
}
```

`html_base64` parameter represents encoded `<body>Hello world</body>`

Then click **Save and test** button. If your function is working correctly, you should receive following output:

```json
{
  "image_base64": "/9j/4AAQSkZJRgABAQEASwBLAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAlBAADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKK81/ZZ/aG/wCGlvAuv61/ZH9i/wBheMfEXhLyftX2nz/7J1e7037Ru2Jt837L5mzB2b9u58biAelUV5r+yb+0N/w1D8IJvFf9kf2H5XiTxB4f+y/avtOf7K1q+0vzt+xP9b9j83bt+TzNuW27iftZftDf8MvfCCHxX/ZH9ueb4k8P+H/sv2r7Nj+1dasdL87fsf8A1X2zzdu35/L25XduAB6VRXmvwV/aG/4XB8X/AIweFP7I/s7/AIVR4ks/D/2r7V539qfaNF07VPO2bF8rb/aHlbdz58ndkbtq+lUAFFFFABRRXmvx8/aG/wCFH+OvhJov9kf2p/wtPxi3hLzvtXkf2ZjSNT1L7Rt2N5v/ACDvL2ZT/Xbt3ybWAPSqK81/bI/aG/4ZJ/ZO+JHxQ/sj/hIP+FfeG7/xB/Zn2r7J9v8As0DzeT5ux/L3bMbtjYznB6V6VQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFfAH7C/7JXiv4p+DPiZrel/tC/GzwFZXfxg+ICponh6Pw6dPtdvivVFJj+2aTcT5cgu26VvmY42jCj7/AKKAPya13w3rujf8EgfBmly+JrOTwjYfHDxjbeP9b8V6RcarY3Wkr4m8Tp5+qW2nS2bSQPqH2BpvLeKFQWZ18lXjPK/BfwraaD+yL8WLjwn4w8OeJ/hldfFv4Wx6FD4P8K32heDbO7TxZpH219I+13940sb77YSmEpAssTbAzM+P2PooA/N79o4ayfC37dP9lf8ACRfYP+Fs+D/+El/sDzv7U/4R7+wfCP8AbP2fyf3u/wDs37X/AKv59u7b82K3v+CdSfBlf289U/4ZX/s//hTX/CAy/wDCYf8ACO+d/wAI5/b/ANvtv7O8vP7r7b9l/tHz/L+fb5Hm87a/QOigD8vf+Cpvwuuz+3VH8KrS3v08O/tyaVonhrWJ7TdmGTQdRWbU23D7jzaFcTRgnj/RR124riP2IP8AhbHx1/Z8/aD8aaPDqY+LnwH+Ecv7PvheaOMpc3HiLS4bqXULmHPWWa4/svaRxuhHpX680UAfmF+xon7Pg/bN+B3/AAyj9o+3/Y9T/wCFr/Yvtnm/2Z/Zkvk/275v/MS/tT7Ft8//AEj/AI+f4d1c3+wh+zj4S+DP7In/AATq8S6Jp8ieI/H/AIp0S/1/U7i4kuLnUGTwH4l8iNmdjtihSRo40XCogAAr9YaKAPwV/afi/Zwk/wCCV/xUHjz+1j+2yvhrVG8W7vt//CY/2wBL9rLY5/sbbv6f6J9jxjtX71UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//Z"
}
```

The function will respond with a JPG encoded in Base64

## Options

There are many options available to [wkhtmltoimage](http://wkhtmltopdf.org/docs.html). All of the command line options are supported as documented on the page linked to above. The options are camelCased instead-of-dashed as in the command line tool. Note that options that do not have values, must be specified as a boolean, e.g. debugJavascript: true

```json
{
    "html_base64" : "PGJvZHk+SGVsbG8gd29ybGQ8L2JvZHk+",
	"options":
	{
		"format": "jpg"
	}
}
```