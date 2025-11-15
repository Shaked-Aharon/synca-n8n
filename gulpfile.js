const path = require('path');
const { task, src, dest } = require('gulp');
// const { Transform } =  require('stream');

task('build:icons', copyIcons);
task('build:move', moveBuild)

function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	src(nodeSource).pipe(dest(nodeDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return src(credSource).pipe(dest(credDestination));
}

function moveBuild() {
	const distSource = path.resolve('dist', '**', "*");
	const n8nCustomNodesDestination = path.resolve('C:\\Users\\shaked\\Desktop\\DevOps\\Scripts\\n8n\\custom-nodes\\n8n-nodes-synca');

	return src(distSource).pipe(dest(n8nCustomNodesDestination));
}

// function filterNonEmptyFiles() {
// 	return new Transform({
// 		objectMode: true,
// 		transform(file, _enc, cb) {
// 			// If no contents at all – skip
// 			if (file.isNull()) {
// 				return cb();
// 			}

// 			// Most common case: buffered files
// 			if (file.isBuffer()) {
// 				const text = file.contents.toString();
// 				if (text.trim().length === 0) {
// 					// empty or whitespace-only -> skip
// 					return cb();
// 				}
// 				// non-empty -> pass through
// 				this.push(file);
// 				return cb();
// 			}

// 			// If you don't use streaming files, you can just skip this branch:
// 			if (file.isStream()) {
// 				let data = '';
// 				file.contents.on('data', (chunk) => {
// 					data += chunk.toString();
// 				});
// 				file.contents.on('end', () => {
// 					if (data.trim().length > 0) {
// 						this.push(file);
// 					}
// 					cb();
// 				});
// 			}
// 		},
// 	});
// }

// export function moveBuild() {
// 	const distSource = path.resolve('dist', '**');
// 	const n8nCustomNodesDestination = path.resolve(
// 		'C:\\Users\\shaked\\Desktop\\DevOps\\Scripts\\n8n\\custom-nodes\\n8n-nodes-synca',
// 	);

// 	return src(distSource, { nodir: true })
// 		.pipe(filterNonEmptyFiles())
// 		.pipe(dest(n8nCustomNodesDestination));
// }