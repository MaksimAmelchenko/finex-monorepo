import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import { ILogger } from '../types/app';

interface IResult {
  stdout: string;
  stderr?: string;
  code?: number;
}

export async function exec(
  log: ILogger,
  command: string,
  args: ReadonlyArray<string>,
  options: SpawnOptions = {}
): Promise<IResult> {
  const start: number = Date.now();
  try {
    const duration: number = Math.ceil(Date.now() - start);
    log.trace({ exec: { command, args, options } });

    const result = await new Promise<IResult>((resolve, reject) => {
      let stderr = '';
      let stdout = '';

      const cmd: ChildProcess = spawn(command, args, options);

      cmd.stdout?.on('data', data => {
        stdout += data;
      });

      cmd.stderr?.on('data', data => {
        stderr += data;
      });

      cmd.on('close', code => {
        if (code === 0) {
          resolve({
            stdout,
            stderr,
            code,
          });
        } else {
          reject({
            stdout,
            stderr,
            code,
          });
        }
      });
    });

    log.debug({ duration, exec: { command, args, options }, result });
    return result;
  } catch (err) {
    log.error({ exec: { command, args, options }, err });
    throw err;
  }
}
