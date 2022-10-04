import { mediaSoupConfig } from '@app/mediasoup.config';
import net from 'net';

function isPortAvailable(port: number) {
  return new Promise<boolean>((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      resolve(true);

      server.close();
    });

    server.listen(port, '127.0.0.1');
  });
}

function getRandomMediasoupPort() {
  return Math.floor(
    Math.random() *
      (mediaSoupConfig.mediasoup.worker.rtcMaxPort -
        mediaSoupConfig.mediasoup.worker.rtcMinPort +
        1) +
      mediaSoupConfig.mediasoup.worker.rtcMinPort,
  );
}

export async function getRemoteRTPPort() {
  let port: number;
  let isAvailable = false;
  let count = 0;

  while (!isPortAvailable) {
    count++;
    port = getRandomMediasoupPort();
    isAvailable = await isPortAvailable(port);

    if (count > 99 && count % 100 === 0) {
      console.warn(
        `Tried to find a port ${count} times, but couldn't find one`,
      );
    }

    if (count === 1000) {
      console.error('Failed to find a free port after 1000 tries, exiting');
      throw new Error('Cannot find a port for remote RTP');
    }
  }

  return port;
}
