const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const { join } = require('path');
const { format } = require('date-fns')


const app = express();
const absPebbleDevPath = join(__dirname, 'pebble-dev');

var projects;

const timeFormat = time => {
	const first = format(time, 'dd LLLL');
	const sec = format(time, 'yy - HH:mm')
	return first + ', \'' + sec;
}

const projectInfo = () => {
	const allDirs = fs.readdirSync(absPebbleDevPath);
	
	var projectNames = [];
	var lastModified = [];
	var lastBuild = [];

	for (var i = 0; i < allDirs.length; i++){
		const currProjectPath = join(absPebbleDevPath, allDirs[i]);
		const currProjectSrcPath = join(currProjectPath, 'src');
		const currProjectBuildPath = join(currProjectPath, 'build');
		const currProjectPackageJSON =  join(currProjectPath, 'package.json');
		const currProjectWscript = join(currProjectPath, 'wscript');
		
		if (fs.existsSync(currProjectSrcPath) && fs.existsSync(currProjectWscript) && fs.existsSync(currProjectPackageJSON)){
			projectNames.push(allDirs[i]);
			lastModified.push(timeFormat(fs.statSync(currProjectSrcPath).mtime));
			if (fs.existsSync(currProjectBuildPath)) {
				lastBuild.push(timeFormat(fs.statSync(currProjectBuildPath).mtime));
			}
			else {
				lastBuild.push('Never');
			}
		}
	}
	return {name: projectNames, modified: lastModified, build: lastBuild};
}


app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'ejs');


app.post('/new', (req, res) => {
	const projectName = req.body.projectName;
	const projectType = req.body.type;
	const extraSimple = req.body.simple;
	const extraJS     = req.body.js;
	
	const dir = join(absPebbleDevPath, projectName);

	if (!projectName) {
		res.render('projects', {projects : projects, success: 'err_empty', message : '', visibility: 'visible'})
		return;
	}
	if (fs.existsSync(dir)) {
		res.render('projects', {projects : projects, success: 'err_name', message: '', visibility: 'visible'})
		return;
	}

	const dockerPebblePath = join(absPebbleDevPath, ':', 'pebble');
	
	var cmd = 'docker run --rm -v ' + dockerPebblePath + ' bboehmke/pebble-dev pebble new-project --' + projectType;

	if (projectType == 'c') {
		if (extraSimple){
			cmd += ' ' + extraSimple;
		}
		if (extraJS) {
			cmd += ' ' + extraJS;
		}
	}
	
	cmd += ' ' + projectName;
	exec(cmd, (err, stdout, stderr) => {
		projects = projectInfo();
		res.render('projects', {projects : projects, success: 'succ', message: stdout, visibility: 'visible'});
		res.end();
	})
});

app.get('/', (req, res) => {
	projects = projectInfo();
	res.render('projects', {projects : projects, success: undefined, message: '', visibility: 'hidden'});
});

app.get('/:projectName', (req, res) => {
	const currProjectSrcPath = join(absPebbleDevPath, req.params['projectName'], 'src');
	
	var files;
	var filesContent = []; 

	if (fs.existsSync(currProjectSrcPath)){
		const dirs = fs.readdirSync(currProjectSrcPath);

		var contents = []

		for (var i = 0; i < dirs.length; i++){
			const directoryWalk = fs.readdirSync(join(currProjectSrcPath, dirs[i]));
			contents.push(directoryWalk);

			
			for (var j = 0; j < directoryWalk.length; j++){
				const readLines = fs.readFileSync(join(currProjectSrcPath, dirs[i], directoryWalk[j]));
				filesContent.push(readLines);
			}

		}

		files = {dir: dirs, content: contents};
	}

	res.render('currProject', {name: req.params['projectName'], file: files, fileContent: filesContent});
	
});

const server = app.listen(3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});