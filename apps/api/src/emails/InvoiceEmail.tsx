import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface InvoiceEmailProps {
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  invoiceUrl: string;
}

export function InvoiceEmail({
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  invoiceUrl,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Invoice #{invoiceNumber} from QuoteMaster</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Invoice #{invoiceNumber}</Text>
            <Text style={paragraph}>
              Hi {clientName},
            </Text>
            <Text style={paragraph}>
              Your invoice is ready. Here are the details:
            </Text>
            <Section style={invoiceDetails}>
              <Text style={detailRow}>
                <strong>Invoice Number:</strong> {invoiceNumber}
              </Text>
              <Text style={detailRow}>
                <strong>Amount Due:</strong> ${amount.toFixed(2)}
              </Text>
              <Text style={detailRow}>
                <strong>Due Date:</strong> {dueDate}
              </Text>
            </Section>
            <Button style={button} href={invoiceUrl}>
              View Invoice
            </Button>
            <Hr style={hr} />
            <Text style={footer}>
              Please contact us if you have any questions about this invoice.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
};

const invoiceDetails = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '5px',
  margin: '20px 0',
};

const detailRow = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#484848',
  margin: '5px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '10px',
  marginTop: '20px',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};

const footer = {
  color: '#9ca299',
  fontSize: '14px',
  lineHeight: '24px',
};
