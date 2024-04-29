import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import PopulationPage from "./population";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("PopulationPage", () => {
  beforeEach(() => {
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: {
        result: [
          { prefCode: 1, prefName: "Prefecture 1" },
          { prefCode: 2, prefName: "Prefecture 2" },
        ],
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the page title", () => {
    render(<PopulationPage />);
    expect(screen.getByText("都道府県別人口推移")).toBeInTheDocument();
  });

  it("fetches and displays prefectures", async () => {
    render(<PopulationPage />);
    await waitFor(() => {
      expect(screen.getByText("Prefecture 1")).toBeInTheDocument();
      expect(screen.getByText("Prefecture 2")).toBeInTheDocument();
    });
  });

  it("selects and deselects prefectures", async () => {
    render(<PopulationPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("Prefecture 1"));
      expect(axios.get).toHaveBeenCalledWith(
        "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=1",
        expect.anything()
      );
      fireEvent.click(screen.getByLabelText("Prefecture 1"));
      expect(screen.getByLabelText("Prefecture 1")).not.toBeChecked();
    });
  });

  it("changes population type", () => {
    render(<PopulationPage />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "年少人口" },
    });
    expect(screen.getByRole("combobox")).toHaveValue("年少人口");
  });

  it("renders loading state when fetching data", () => {
    render(<PopulationPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error message when data fetch fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("Fetch error"));
    render(<PopulationPage />);
    await waitFor(() => {
      expect(screen.getByText("Error fetching data")).toBeInTheDocument();
    });
  });

  it("renders no data message when result is empty", async () => {
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: { result: [] } });
    render(<PopulationPage />);
    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });
});
