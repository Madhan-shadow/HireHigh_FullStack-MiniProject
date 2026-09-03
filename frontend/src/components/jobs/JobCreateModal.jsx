import React, {
  useEffect,
  useState
} from "react";

const empty = {
  title: "",
  department: "",
  hiringGoal: 1,
  status: "OPEN",
  description: ""
};

export default function JobCreateModal({
  open,
  onClose,
  onSubmit,
  initialData = null
}) {

  const [form, setForm] =
    useState(empty);

  useEffect(() => {

    if (initialData) {

      setForm({
        title:
          initialData.title || "",

        department:
          initialData.department || "",

        hiringGoal:
          initialData.hiringGoal || 1,

        status:
          initialData.status || "OPEN",

        description:
          initialData.description || ""
      });

    } else {

      setForm(empty);

    }

  }, [initialData, open]);

  if (!open) {
    return null;
  }

  const update = (e) => {

    setForm((previous) => ({
      ...previous,
      [e.target.name]:
        e.target.value
    }));

  };

  const submit = (e) => {

    e.preventDefault();

    onSubmit({
      ...form,
      hiringGoal:
        Number(form.hiringGoal) || 1
    });

  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {

        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
      >

        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <p className="eyebrow">

          {initialData
            ? "Edit Role"
            : "New Role"}

        </p>

        <h2>

          {initialData
            ? "Edit Job"
            : "Post New Job"}

        </h2>

        <form
          className="form-stack"
          onSubmit={submit}
        >

          <label>

            Job Title

            <input
              name="title"
              value={form.title}
              onChange={update}
              placeholder="e.g. Senior Java Developer"
              required
            />

          </label>

          <label>

            Department

            <input
              name="department"
              value={form.department}
              onChange={update}
              placeholder="e.g. Engineering"
              required
            />

          </label>

          <label>

            Hiring Goal (Open Seats)

            <input
              name="hiringGoal"
              type="number"
              min="1"
              value={form.hiringGoal}
              onChange={update}
              required
            />

          </label>

          {initialData && (

            <label>

              Status

              <select
                name="status"
                value={form.status}
                onChange={update}
              >

                <option value="OPEN">
                  OPEN
                </option>

                <option value="CLOSED">
                  CLOSED
                </option>

                <option value="ON_HOLD">
                  ON_HOLD
                </option>

              </select>

            </label>

          )}

          <label>

            Description

            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={update}
              placeholder="Detailed job description..."
            />

          </label>

          <div className="modal-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              type="submit"
            >

              {initialData
                ? "Update Job"
                : "Post Job"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}