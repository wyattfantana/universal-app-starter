import 'dotenv/config';
import PgBoss from 'pg-boss';

// =========================================
// ENVIRONMENT VALIDATION
// =========================================
const REQUIRED_VARS = ['POSTGRES_HOST', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];

console.log('🔍 Validating worker environment variables...');
let hasErrors = false;

REQUIRED_VARS.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n⛔ Cannot start worker without required environment variables');
  process.exit(1);
}

console.log('✅ Environment variables validated\n');

// =========================================
// PG-BOSS CONFIGURATION
// =========================================
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB}`;

const boss = new PgBoss({
  connectionString,
  // pg-boss will create its own schema and tables in PostgreSQL
  schema: 'pgboss',
  // Archive completed jobs for debugging
  archiveCompletedAfterSeconds: 60 * 60 * 24, // 24 hours
  // Delete archived jobs after 7 days
  deleteAfterDays: 7,
  // Monitor every 30 seconds
  monitorStateIntervalSeconds: 30,
});

// =========================================
// JOB HANDLERS
// =========================================

/**
 * Send an email via Resend
 */
async function handleSendEmail(job: PgBoss.Job) {
  const { to, subject, body, userId } = job.data;

  console.log(`📧 [${job.id}] Sending email to ${to}...`);

  try {
    // TODO: Integrate with Resend API when RESEND_API_KEY is set
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  RESEND_API_KEY not set - email not sent (development mode)');
      return { status: 'skipped', reason: 'RESEND_API_KEY not configured' };
    }

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`✅ [${job.id}] Email sent successfully`);
    return { status: 'sent', to, subject };
  } catch (error) {
    console.error(`❌ [${job.id}] Failed to send email:`, error);
    throw error; // pg-boss will retry
  }
}

/**
 * Generate a PDF invoice
 */
async function handleGeneratePDF(job: PgBoss.Job) {
  const { invoiceId, userId } = job.data;

  console.log(`📄 [${job.id}] Generating PDF for invoice ${invoiceId}...`);

  try {
    // TODO: Integrate with PDF generation library (e.g., Puppeteer or @react-pdf/renderer)
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`✅ [${job.id}] PDF generated successfully`);
    return { status: 'generated', invoiceId, url: `/pdfs/invoice-${invoiceId}.pdf` };
  } catch (error) {
    console.error(`❌ [${job.id}] Failed to generate PDF:`, error);
    throw error;
  }
}

/**
 * Process a payment via Stripe
 */
async function handleProcessPayment(job: PgBoss.Job) {
  const { invoiceId, amount, customerId, userId } = job.data;

  console.log(`💳 [${job.id}] Processing payment for invoice ${invoiceId}: $${amount}...`);

  try {
    // TODO: Integrate with Stripe API when STRIPE_SECRET_KEY is set
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('⚠️  STRIPE_SECRET_KEY not set - payment not processed (development mode)');
      return { status: 'skipped', reason: 'STRIPE_SECRET_KEY not configured' };
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log(`✅ [${job.id}] Payment processed successfully`);
    return { status: 'processed', invoiceId, amount };
  } catch (error) {
    console.error(`❌ [${job.id}] Failed to process payment:`, error);
    throw error;
  }
}

/**
 * Send a notification (email or push)
 */
async function handleNotification(job: PgBoss.Job) {
  const { userId, type, title, message } = job.data;

  console.log(`🔔 [${job.id}] Sending ${type} notification: "${title}"...`);

  try {
    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`✅ [${job.id}] Notification sent successfully`);
    return { status: 'sent', type, title };
  } catch (error) {
    console.error(`❌ [${job.id}] Failed to send notification:`, error);
    throw error;
  }
}

// =========================================
// WORKER STARTUP
// =========================================
async function startWorker() {
  try {
    console.log('🔌 Connecting to PostgreSQL via pg-boss...');
    await boss.start();
    console.log('✅ pg-boss connected and ready\n');

    // Register job handlers
    await boss.work('send-email', { teamSize: 5, teamConcurrency: 2 }, handleSendEmail);
    await boss.work('generate-pdf', { teamSize: 3, teamConcurrency: 1 }, handleGeneratePDF);
    await boss.work('process-payment', { teamSize: 2, teamConcurrency: 1 }, handleProcessPayment);
    await boss.work('send-notification', { teamSize: 10, teamConcurrency: 5 }, handleNotification);

    console.log('🚀 Background worker started and listening for jobs:\n');
    console.log('   📧 send-email          - Email delivery');
    console.log('   📄 generate-pdf        - PDF invoice generation');
    console.log('   💳 process-payment     - Stripe payment processing');
    console.log('   🔔 send-notification   - Push/email notifications\n');

    console.log('💡 Queue jobs from your API using:');
    console.log(`   await boss.send('send-email', { to, subject, body, userId });\n`);
  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
}

// =========================================
// GRACEFUL SHUTDOWN
// =========================================
async function shutdown(signal: string) {
  console.log(`\n🛑 ${signal} received, shutting down worker gracefully...`);

  try {
    await boss.stop();
    console.log('✅ Worker stopped gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  shutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  shutdown('UNHANDLED_REJECTION');
});

// =========================================
// START
// =========================================
startWorker();
