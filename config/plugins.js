module.exports = ({ env }) => {
  const plugins = {
    graphql: {
      enabled: true,
      config: {
        endpoint: '/graphql',
        shadowCRUD: true,
        playgroundAlways: false,
        depthLimit: 15,
        amountLimit: 100,
        apolloServer: {
          tracing: false,
        },
      },
    },
  };

  if (env('CLOUDINARY_NAME')) {
    plugins.upload = {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    };
  }

  return plugins;
};
