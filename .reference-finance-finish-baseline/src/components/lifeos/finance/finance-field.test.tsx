import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/ui/input";
import { FinanceField } from "./finance-field";

describe("FinanceField", () => {
  it("uses the shared compact label-to-control spacing", () => {
    render(
      <FinanceField label="Amount">
        <Input aria-label="Amount value" />
      </FinanceField>,
    );

    expect(screen.getByText("Amount").parentElement).toHaveClass(
      "grid",
      "gap-1.5",
    );
    expect(screen.getByLabelText("Amount value")).toBeVisible();
  });
});
