#! /usr/bin/env node

import * as fs from "fs";
import path from "path";

import chalk from "chalk"
import inquirer, { DistinctQuestion } from "inquirer";
import minimist from "minimist";

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const choices = fs.readdirSync(path.join(__dirname, "templates"));
const curr_dir = process.cwd();
const args = minimist(process.argv.slice(2), {
	string: ["name", "author", "template"],
});

type CLIOption = {
	projectPath: string;
	projectName: string;
	author: string;
	template: string;
}

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

console.log({
	projectPath: fullProjectPath,
	projectName: suggestedName
})

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