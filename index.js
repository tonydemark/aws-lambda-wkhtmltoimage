var MemoryStream = require('memorystream');
var wkhtmltoimage = null;
var wkhtmltopdf = null;
var zlib = null;
var AWS = null;

/*

{
  "html": "eJyzySjJzbGzScpPqbTzSM3JyddRKM8vyklRtNEHi9nogxUAABNnDZY=",
  "input_compressed": "true",
  "output_compressed": "true",
  "output_type": "pdf",
  "output_bucket": "assetmap-lambda-wkhtmltoimage",
  "options": {
    "loadErrorHandling": "ignore",
    "loadMediaErrorHandling": "ignore",
    "zoom": "4"
  }
}

{
  "html_uncompressed": "PGh0bWw+PGJvZHk+SGVsbG8sIHdvcmxkITwvYm9keT48L2h0bWw+",
  "html_compressed": "eJyzySjJzbGzScpPqbTzSM3JyddRKM8vyklRtNEHi9nogxUAABNnDZY=",
  "html": "eJyzySjJzbGzScpPqbTzSM3JyddRKM8vyklRtNEHi9nogxUAABNnDZY=",
  "input_compressed": "true",
  "output_compressed": "false",
  "output_type": "pdf",
  "output_bucket": "assetmap-lambda-wkhtmltoimage",
  "image_options": {
    "format": "jpg"
  },
  "pdf_options": {
    "loadErrorHandling": "ignore",
    "loadMediaErrorHandling": "ignore",
    "width": "4096",
    "zoom": "4",
    "format": "jpg"
  },
  "options": {
    "loadErrorHandling": "ignore",
    "loadMediaErrorHandling": "ignore",
    "zoom": "4"
  }
}

*/

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

exports.handler = function(event, context) {
	var outputType = 'image';
	var inputCompressed = false;
	var outputCompressed = false;
	var output_to_s3 = false;
	var options_s3 = { };

	try {
		outputType = event.output_type;
	} catch (e) {
		
	}

	try {
		inputCompressed = (event.input_compressed == "true") ? true : false;
	} catch (e) {
		
	}

	try {
		outputCompressed = (event.output_compressed == "true") ? true : false;
	} catch (e) {
		
	}

	try {
		if (typeof event.output_bucket != "undefined") {
			options_s3 = {
				Bucket: event.output_bucket,
				Key: context.awsRequestId
			}
			output_to_s3 = true;
		}
	} catch (e) {
		return context.done(null, { error: true, code: 503, message: "Error setting up S3 output configuration: " + e });
	}

	var zlib = null;
	if (inputCompressed || outputCompressed) {
		zlib = require('zlib');
	}

	if (output_to_s3) {
		AWS = require('aws-sdk');
		s3 = new AWS.S3();
	}

	var memStream = new MemoryStream();
	var html = new Buffer(event.html, 'base64')
	
	if (inputCompressed) {
		try {
			html = zlib.unzipSync(html);
		} catch (e) {
			return context.done(null, { error: true, code: 500, message: "Unable to unzip input: " + e });
		}
	}
	
	html = html.toString('utf8');

	switch (outputType) {
		case 'image':
		default:
			wkhtmltoimage = require('wkhtmltoimage');
			try {
				wkhtmltoimage.generate(html, event.options, function(code, signal) {
					try {
						var content = memStream.read();
						if (outputCompressed) {
							try {
								content = zlib.gzipSync(content);
							} catch (e) {
								return context.done(null, { error: true, code: 501, message: "Unable to compress output: " + e });
							}
						}
						if (output_to_s3) {
							options_s3.Body = content;
							s3.upload(options_s3, function(err,data) {
								if (err) {
									return context.done(null, {
										error: true,
										code: 504,
										message: "Error writing to S3: " + err,
										compressed: outputCompressed,
										content: event.output_bucket + '/' + context.awsRequestId
									});
								} else {
									return context.done(null, {
										error: false,
										code: 200,
										message: "OK",
										compressed: outputCompressed,
										content: event.output_bucket + '/' + context.awsRequestId
									});
								}
							});
						} else {
							context.done(null, {
								error: false,
								code: 200,
								message: "OK",
								compressed: outputCompressed,
								content: content.toString('base64')
							});
						}
					} catch (e) {
						return context.done(null, { error: true, code: 507, message: "Unable to generate image " + e });
					}
				}).pipe(memStream);
			} catch (e) {
				return context.done(null, { error: true, code: 506, message: "Unable to generate image " + e });
			}
			break;
		
		case 'pdf':
			wkhtmltopdf = require('wkhtmltopdf');
			try {
				wkhtmltopdf(html, event.options, function(code, signal) {
					try {
						var content = memStream.read();
						if (outputCompressed) {
							try {
								content = zlib.gzipSync(content);
							} catch (e) {
								return context.done(null, { error: true, code: 502, message: "Unable to compress output: " + e });
							}
						}
						if (output_to_s3) {
							options_s3.Body = content;
							s3.upload(options_s3, function(err,data) {
								if (err) {
									return context.done(null, {
										error: true,
										code: 505,
										message: "Error writing to S3: " + err,
										compressed: outputCompressed,
										content: event.output_bucket + '/' + context.awsRequestId
									});
								} else {
									return context.done(null, {
										error: false,
										code: 200,
										message: "OK",
										compressed: outputCompressed,
										content: event.output_bucket + '/' + context.awsRequestId
									});
								}
							});
						} else {
							context.done(null, {
								error: false,
								code: 200,
								message: "OK",
								compressed: outputCompressed,
								content: content.toString('base64')
							});
						}
					} catch (e) {
						return context.done(null, { error: true, code: 505, message: "Unable to generate PDF " + e });
					}
				}).pipe(memStream);
			} catch (e) {
				return context.done(null, { error: true, code: 504, message: "Unable to generate PDF " + e });
			}
			break;
	}

};