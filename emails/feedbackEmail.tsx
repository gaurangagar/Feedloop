import * as React from "react";
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Button,
} from "@react-email/components";
import { FeedbackEmailInterface } from "@/types/FeedbackEmailInterface";

export default function FeedbackEmail({
    productname,
    customername,
    orderno,
    organizationName,
    gstin,
    date,
    feedbackForm,
    customerEmail
}: FeedbackEmailInterface) {
return (
    <Html>
        <Head />
        <Preview>We value your feedback on your recent purchase</Preview>
        <Body
            style={{
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f9f9f9",
                color: "#333",
            }}
        >
            <Container
                style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                }}
            >
                <Section style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Thank you for your purchase!
                    </Text>
                </Section>

                <Section style={{ marginBottom: "20px" }}>
                    <Text>Dear {customername},</Text>
                    <Text>
                        We truly appreciate your purchase of <strong>{productname}</strong>.
                    </Text>
                    <Text>
                        Order No: <strong>{orderno}</strong>
                        <br />
                        Date: <strong>{date.toDateString()}</strong>
                    </Text>
                </Section>

                <Section style={{ marginBottom: "20px" }}>
                    <Text>
                        Your feedback helps us improve and provide better
                        service. Please take a moment to fill out our short
                        feedback form.
                    </Text>
                    <Button
                        href={feedbackForm}
                        style={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            padding: "12px 20px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Give Feedback
                    </Button>
                </Section>

                <Section
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "15px",
                        fontSize: "12px",
                        color: "#6b7280",
                    }}
                >
                    <Text>{organizationName}</Text>
                    <Text>GSTIN: {gstin}</Text>
                </Section>
            </Container>
        </Body>
    </Html>
)}