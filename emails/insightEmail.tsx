import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components";
import { FeedbackSummaryEmailInterface } from "@/types/FeedbackSummaryEmailInterface";

// Helper function to render stars
function renderStars(rating: number, max = 5) {
  const fullStars = "★".repeat(Math.round(rating));
  const emptyStars = "☆".repeat(max - Math.round(rating));
  return fullStars + emptyStars;
}

export default function FeedbackSummaryEmail({
  orderId,
  companyName,
  productRating,
  shopRating,
  overallSentiment,
  summary,
  highlights,
  improvements,
  urgentIssues,
  rawFeedback,
}: FeedbackSummaryEmailInterface) {
  return (
    <Html>
      <Head />
      <Body className="bg-gray-100 font-sans p-6">
        <Container className="bg-white rounded-lg shadow-md p-8 max-w-xl mx-auto">
          <Heading className="text-xl font-bold text-gray-800 mb-4">
            Customer Feedback Summary – Order {orderId}
          </Heading>

          <Text className="text-gray-700 mb-4">
            Hello {companyName},
            <br />
            Below is the AI-generated summary of the customer’s feedback for
            this order:
          </Text>

          <Section className="mb-6">
            <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-2">
              Ratings
            </Heading>
            <Text className="text-gray-700">
              Product: {renderStars(productRating)} ({productRating}/5)
            </Text>
            <Text className="text-gray-700">
              Shop: {renderStars(shopRating)} ({shopRating}/5)
            </Text>
          </Section>

          <Section className="mb-6">
            <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-2">
              Overall Sentiment
            </Heading>
            <Text className="text-gray-700">{overallSentiment}</Text>
          </Section>

          <Section className="mb-6">
            <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-2">
              Summary of Experience
            </Heading>
            <Text className="text-gray-700">{summary}</Text>
          </Section>

          <Section className="mb-6">
            <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-2">
              Highlights
            </Heading>
            {highlights.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-700">
                {highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <Text className="text-gray-700">None reported.</Text>
            )}
          </Section>

          <Section className="mb-6">
            <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-2">
              Areas for Improvement
            </Heading>
            {improvements.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-700">
                {improvements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <Text className="text-gray-700">None reported.</Text>
            )}
          </Section>

          <Section className="mb-6">
            <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-2">
              Urgent Issues
            </Heading>
            {urgentIssues.length > 0 ? (
              <ul className="list-disc pl-6 text-red-600">
                {urgentIssues.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <Text className="text-gray-700">None reported.</Text>
            )}
          </Section>

          {rawFeedback && (
            <Section className="mb-6">
              <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-2">
                Raw Feedback (Q&A)
              </Heading>
              <ul className="list-disc pl-6 text-gray-700">
                {rawFeedback.map((f, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>Q:</strong> {f.question}
                    <br />
                    <strong>A:</strong> {f.answer}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Text className="text-gray-700 mt-6">
            Best regards,
            <br />
            Your Feedback System
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
