import { InputFile } from "./src/io/InputFile";
import { OutputFile } from './src/io/OutputFile';
import 'colors';
import { Core } from './src/core/Core';
import Logger from './src/io/Logger';
import * as inquirer from 'inquirer';
import { HashcodeFile } from './src/io/HashcodeFile';
import { first, map, filter, isEmpty } from 'lodash';

interface Options {
  printCompletion: boolean;
}

class Hashcode2020 {
  constructor(private fileName: string, private options: Options = { printCompletion: false }) {
  }

  static runFiles(fileNames: string[]) {
    const noParallel = !isEmpty(process.argv.filter(value => /--no-parallel/.test(value)));
    const files = fileNames.map(fileName => new Hashcode2020(fileName, {
      printCompletion: noParallel,
    }));

    if (noParallel) {
      Hashcode2020.runSerially(files).catch(Logger.error);
    } else {
      files.forEach(file => file.run().catch(Logger.error));
    }
  };

  private static async runSerially(files: Hashcode2020[]) {
    for (const file of files) {
      await file.run();
    }
  };

  async run() {
    const computationLabel = `Compute "${this.fileName}"`;
    console.time(computationLabel);
    const input = await this.read();
    this.write(new Core(input).compute());
    console.timeEnd(computationLabel);

    if (this.options.printCompletion) {
      Logger.space();
    }
  }

  private async read() {
    const file = new InputFile(this.getInputFileName());
    return await file.read();
  }

  private async write(output: string) {
    const file = new OutputFile(this.getOutputFileName());
    await file.write(output);
  }

  private getInputFileName() {
    return `${this.fileName}.in`;
  }

  private getOutputFileName() {
    return `${this.fileName}.out`;
  }
}

const promptFiles = async (): Promise<string[]> => {
  const fileArgs = filter(process.argv, (arg: string) => /^(.+).in$/.test(arg));
  if (!isEmpty(fileArgs)) {
    return map(fileArgs, arg => arg.match(/^(.+).in$/)[1]);
  }

  const files = await HashcodeFile.glob('data/*.in');
  const name = 'dataSet';
  const allFiles = 'All files';
  const answer = await inquirer.prompt([{
    name,
    choices: [allFiles, ...files],
    type: 'list',
    message: 'Which data set do you want to include?'
  }]);

  let selected = [answer[name]];
  if (first(selected) == allFiles) {
    selected = files;
  }

  return map(selected, selection => selection.match(/^data\/(.+).in$/)[1]);
};

promptFiles().then(Hashcode2020.runFiles).catch(Logger.error);
