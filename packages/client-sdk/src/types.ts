export type Signalers = {
  streamer: {
    connect: (params: {
      dtlsParameters: DtlsParameters;
      mediaPermissionToken: string;
      rtpCapabilities: RtpCapabilities;
    }) => Promise<void>;
    produce: (params: {
      producerOptions: any;
      mediaPermissionToken: string;
    }) => Promise<{ id: string }>;
  };
  consumer: {
    connect: (params: {
      dtlsParameters: DtlsParameters;
      mediaPermissionToken: string;
    }) => Promise<void>;
  };
};
