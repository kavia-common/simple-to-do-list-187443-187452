import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mock the API client to avoid network calls
jest.mock("./api/client", () => {
  const original = jest.requireActual("./api/client");
  return {
    ...original,
    getTasks: jest.fn().mockResolvedValue([
      { id: 1, title: "Buy milk", completed: false },
      { id: 2, title: "Read book", completed: true },
      { id: 3, title: "Call Alice", completed: false },
    ]),
    apiBaseUrl: jest.fn().mockReturnValue("http://localhost:4000"),
  };
});

test("renders search input and filters tasks", async () => {
  render(<App />);

  // Search input renders
  const search = await screen.findByRole("searchbox", { name: /search tasks/i });
  expect(search).toBeInTheDocument();

  // Initial tasks appear (after mock load)
  await screen.findByText("Buy milk");
  await screen.findByText("Read book");
  await screen.findByText("Call Alice");

  // Type into search and expect filtering to hide non-matching items
  fireEvent.change(search, { target: { value: "milk" } });

  await waitFor(() => {
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.queryByText("Read book")).not.toBeInTheDocument();
    expect(screen.queryByText("Call Alice")).not.toBeInTheDocument();
  });
});
