#! /usr/bin/env node

import * as fs from "fs";
import path from "path";

import chalk from "chalk"
import inquirer, { DistinctQuestion } from "inquirer";
import minimist from "minimist";
import ejs from "ejs";

import { fileURLToPath } from 'url';

type TemplateData = {
	projectName: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const choices = fs.readdirSync(path.join(__dirname, "templates"));
const args = minimist(process.argv.slice(2), {
	string: ["name", "template"],
});

async function main() {
	const projectPath: string | undefined = args["_"][0];
	const fullProjectPath: string = path.resolve(cwd, projectPath || "");
	const suggestedName = args["name"] != null
		? args["name"]
		: path.basename(fullProjectPath);

	const selectedTemplate: string | undefined = args["template"]

	if (selectedTemplate != undefined && !choices.includes(selectedTemplate)) {
		console.log(chalk.yellowBright(selectedTemplate), chalk.red("is not a valid template."));
		console.log(chalk.green("The available templates are:"));
		choices.forEach(t => {
			console.log(chalk.blue("*"), chalk.green(t))
		})
		process.exit(1);
	}

	checkEmptyDir(fullProjectPath);

	const questions: DistinctQuestion[] = []

	if (selectedTemplate == undefined) {
		questions.push({
			type: "list",
			name: "template",
			message: "Which template do you want to use?",
			choices
		})
	}
	if (args["name"] == undefined) {
		questions.push({
			type: "input",
			name: "projectName",
			message: "What project name do you want to use?",
			default: suggestedName
		});
	}

	const answers = await inquirer.prompt(questions);

	const template = selectedTemplate || answers["template"];
	const projectName = args["name"] || answers["projectName"];

	assertRootDir(fullProjectPath);
	const templateDir = path.join(__dirname, "templates", template);
	const templateData: TemplateData = {
		projectName
	};

	createProject(fullProjectPath, templateDir, templateData);
}

function checkEmptyDir(dir: string) {
	if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0) {
		console.log(chalk.red("The root of the project must be empty."));
		process.exit(1);
	}
}

function assertRootDir(dir: string) {
	switch (fs.existsSync(dir)) {
		case true:
			// Already checked that it's empty
			break;
		case false:
			fs.mkdirSync(dir);
			break;
	}
}

function createProject(targetDir: string, templateDir: string, templateData: TemplateData) {
	// Copy the template files to the target directory recursively
	const copyRecursive = (src: string, dest: string) => {
		fs.readdirSync(src).forEach((file) => {
			const current = path.resolve(src, file);
			const target = path.resolve(dest, file);
			if (fs.lstatSync(current).isDirectory()) {
				fs.mkdirSync(target);
				copyRecursive(current, target);
			} else {
				const content = fs.readFileSync(current, "utf8");
				const result = ejs.render(content, templateData);
				fs.writeFileSync(target, result, "utf8");
			}
		})
	}
	copyRecursive(templateDir, targetDir);
}

main()