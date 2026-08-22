import React, {
  useEffect,
  useRef,
  useState
} from "react";

import { useSelector } from "react-redux";
import applicationService from "../../services/applicationService";

function ApplicationList() {
  const { role } = useSelector(
    (state) => state.auth
  );

  const [applications, setApplications] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [stageFilter, setStageFilter] =
    useState("ALL");

  const [error, setError] =
    useState("");

  const searchInputRef = useRef(null);

  const loadApplications = async () => {
    try {
      setError("");

      const response =
        await applicationService.getAll();

      if (Array.isArray(response)) {
        setApplications(response);
      } else {
        setApplications(
          response?.content || []
        );
      }
    } catch (err) {
      if (err.response?.status === 500) {
        setError(
          "Server error. Please try again later."
        );
      } else if (
        err.response?.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        window.location.href = "/login";
      } else {
        setError(
          err.response?.data?.message ||
          "Failed to load applications."
        );
      }
    }
  };

  /*
   * T10 + T11
   *
   * Initial render calls getAll once.
   * Changing search/stage causes re-fetch.
   */
  useEffect(() => {
    loadApplications();
  }, [search, stageFilter]);

  /*
   * T12
   */
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  /*
   * T8 + T9
   */
  const filteredApplications =
    applications.filter((application) => {

      const candidate =
        application.candidate?.user?.username ||
        application.candidate?.user?.email ||
        "";

      const job =
        application.job?.title || "";

      const searchValue =
        `${candidate} ${job}`.toLowerCase();

      const matchesSearch =
        searchValue.includes(
          search.toLowerCase()
        );

      const matchesStage =
        stageFilter === "ALL" ||
        application.currentStage ===
          stageFilter;

      return (
        matchesSearch &&
        matchesStage
      );
    });

  return (
    <div>

      <h1>Applications</h1>

      {error && (
        <div
          role="alert"
          style={{ color: "red" }}
        >
          {error}
        </div>
      )}

      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search applications"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
        value={stageFilter}
        onChange={(e) =>
          setStageFilter(e.target.value)
        }
      >
        <option value="ALL">
          All Stages
        </option>

        <option value="APPLIED">
          Applied
        </option>

        <option value="SCREENING">
          Screening
        </option>

        <option value="INTERVIEW">
          Interview
        </option>

        <option value="OFFERED">
          Offered
        </option>

        <option value="HIRED">
          Hired
        </option>

        <option value="REJECTED">
          Rejected
        </option>
      </select>

      {(role === "RECRUITER" ||
        role === "TA_LEAD" ||
        role === "ADMIN") && (
        <section>
          <h2>Recruitment Pipeline</h2>

          <div>
            <strong>
              Total Applications:
            </strong>{" "}
            {filteredApplications.length}
          </div>
        </section>
      )}

      {role === "CANDIDATE" && (
        <section>
          <h2>My Applications</h2>
        </section>
      )}

      <table>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>Stage</th>
          </tr>
        </thead>

        <tbody>
          {filteredApplications.map(
            (application) => (
              <tr
                key={application.id}
              >
                <td>
                  {application.candidate
                    ?.user?.username ||
                    application.candidate
                    ?.user?.email ||
                    "Candidate"}
                </td>

                <td>
                  {application.job?.title ||
                    "Job"}
                </td>

                <td>
                  {application.currentStage ||
                    "APPLIED"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

    </div>
  );
}

export default ApplicationList;