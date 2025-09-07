import {cleanup, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Notes from "./Notes";

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe("<Notes />", () => {
  it("should display 'no notes'", async () => {
    const {container} = render(<Notes notes="" id="" />);

    expect(screen.getByText("No notes")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("edit"));
    await screen.findByText(/save/i);
    expect(screen.queryByLabelText("Update ladder notes")).toBeInTheDocument();
    expect(container.querySelectorAll("button")).toHaveLength(3);
  });
});
