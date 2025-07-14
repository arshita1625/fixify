// ContactUs.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactUs from "../pages/ContactUs";
import emailjs from '@emailjs/browser';

// Mock the emailjs.send method
jest.mock('@emailjs/browser', () => ({
  send: jest.fn(),
}));

describe("ContactUs Component", () => {
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => { });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders contact us page elements", () => {
    render(<ContactUs />);

    // Check for header and subheader
    expect(screen.getByText(/Connect with Our/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact us for expert help/i)).toBeInTheDocument();

    // Check that the form fields and submit button are rendered
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tell Us About Your Problem/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("submits the form successfully", async () => {
    // Setup the emailjs.send mock to resolve
    emailjs.send.mockResolvedValue({ status: 200, text: "OK" });

    render(<ContactUs />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe", name: "fullName" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890", name: "phone" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "City", name: "location" },
    });
    fireEvent.change(screen.getByLabelText(/Tell Us About Your Problem/i), {
      target: { value: "I need help with plumbing", name: "message" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /Submit/i }));

    // Check that emailjs.send was called with correct params
    await waitFor(() => {
      expect(emailjs.send).toHaveBeenCalledWith(
        "service_rdl10r9",
        "template_yjwfdkf",
        {
          from_name: "John Doe",
          from_email: "john@example.com",
          phone: "1234567890",
          location: "City",
          service: "", // service field was not filled in the form so remains empty
          message: "I need help with plumbing",
        },
        "rDD9O4qnzpJcywjWg"
      );
    });

    // Check that alert was called for success
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Email sent successfully!");
    });

    // Check that the form has been reset
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue("");
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue("");
    expect(screen.getByLabelText(/Location/i)).toHaveValue("");
    expect(screen.getByLabelText(/Tell Us About Your Problem/i)).toHaveValue("");
  });

  test("handles email send failure", async () => {
    // Setup the emailjs.send mock to reject
    emailjs.send.mockRejectedValue(new Error("Email send failed"));

    render(<ContactUs />);

    // Fill in the required form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Jane Doe", name: "fullName" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "jane@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText(/Tell Us About Your Problem/i), {
      target: { value: "Issue description", name: "message" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /Submit/i }));

    // Check that emailjs.send was called
    await waitFor(() => {
      expect(emailjs.send).toHaveBeenCalled();
    });

    // Check that the error alert is shown
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to send email. Please check console for errors.");
    });
  });
});