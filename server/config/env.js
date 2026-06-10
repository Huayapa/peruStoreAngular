export const validateEnv = () => {
  const requiredsEnv = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NODE_ENV', 'CLIENT_URL']

  requiredsEnv.forEach((env) => {
    if(!process.env[env]) {
      console.error(`La variable de entorno '${env}' es requerida.`);
      process.exit(1)
    }
  })
}