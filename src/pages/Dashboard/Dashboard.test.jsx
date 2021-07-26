import { MemoryRouter } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import Dashboard from "./Dashboard";
import DashboardService from "../../services/DashboardService";

const setup = () => {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

const mockDashboard = [
  {
    brand: "Fiat",
    totalPrice: 1000000,
    modelsAvailable: 20,
  },
  {
    brand: "Chevrolet",
    totalPrice: 2000000,
    modelsAvailable: 30,
  },
  {
    brand: "Ford",
    totalPrice: 500000,
    modelsAvailable: 10,
  },
];

const getDashboardSpy = jest.spyOn(DashboardService, "get");

describe("<Dashboard />", () => {
  describe("Successfully fetches dashboard data", () => {
    beforeEach(async () => {
      getDashboardSpy.mockResolvedValue(mockDashboard);
      await act(async () => setup());
    });

    it("should render 'modelos por marca' title", () => {
      expect(screen.getByText(/modelos por marca/i)).toBeInTheDocument();
    });
    it("should render 'preço total por marca' title", () => {
      expect(screen.getByText(/preço total por marca/i)).toBeInTheDocument();
    });

    describe("Graphs", () => {
      describe("by Model", () => {
        it("should render the graph legend", () => {
          expect(screen.getByText(/modelos disponíveis/i)).toBeInTheDocument();
        });
        it("should render the 16 mark", () => {
          expect(screen.getByText(16)).toBeInTheDocument();
        });
      });
      describe("by Price", () => {
        it("should render the graph legend", () => {
          expect(screen.getByText("Preço total")).toBeInTheDocument();
        });
        it("should render the 2000M mark", () => {
          expect(screen.getByText(/2000000/i)).toBeInTheDocument();
        });
      });
    });
  });

  describe("Fails to fetch dashboard data", () => {
    const errorMsg = "Não foi possível buscar os dados da dashboard";
    beforeEach(async () => {
      getDashboardSpy.mockRejectedValue(new Error(errorMsg));
      await act(async () => setup());
    });

    it("should render the error message", () => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
    describe("Graphs", () => {
      it("shouldn't render the model graph", () => {
        expect(
          screen.queryByText(/modelos disponíveis/i)
        ).not.toBeInTheDocument();
      });
      it("shouldn't render the price graph", () => {
        expect(screen.queryByText("Preço total")).not.toBeInTheDocument();
      });
    });
  });
});
