import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  fetchApplications,
  fetchMyApplications
} from "../../store/slices/applicationSlice";

function ApplicationList() {
  const dispatch = useDispatch();

  const { role } = useSelector(
    (state) => state.auth
  );

  const {
    items,
    loading,
    error
  } = useSelector(
    (state) => state.applications
  );

  const [search, setSearch] =
    useState("");

  const [stageFilter, setStageFilter] =
    useState("ALL");

  const searchInputRef =
    useRef(null);

  /*
   * Load applications
   */
  useEffect(() => {
    if (role === "CANDIDATE") {
      dispatch(fetchMyApplications());
    } else {
      dispatch(
        fetchApplications({
          page: 0,
          size: 100,
          search: ""
        })
      );
    }
  }, [dispatch, role]);

  /*
   * T12
   * Focus search box when page loads
   */
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  /*
   * Search + stage filtering
   */
  const filteredApplications =
    items.filter((application) => {

      const username =
        application.candidate
          ?.user
          ?.username || "";

      const email =
        application.candidate
          ?.user
          ?.email || "";

      const jobTitle =
        application.job
          ?.title || "";

      const searchValue =
        `${username} ${email} ${jobTitle}`
          .toLowerCase();

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

  const isCandidate =
    role === "CANDIDATE";

  const isRecruitmentRole =
    role === "RECRUITER" ||
    role === "TA_LEAD" ||
    role === "ADMIN";

  return (
    <div>

      <h1>
        {isCandidate
          ? "My Applications"
          : "Applications"}
      </h1>

      {error && (
        <div
          role="alert"
          style={{
            color: "red",
            marginBottom: "10px"
          }}
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

      {isRecruitmentRole && (
        <section>
          <h2>
            Recruitment Pipeline
          </h2>

          <div>
            <strong>
              Total Applications:
            </strong>{" "}
            {filteredApplications.length}
          </div>
        </section>
      )}

      {isCandidate && (
        <section>
          <h2>
            My Applications
          </h2>
        </section>
      )}

      {loading ? (
        <p>
          Loading applications...
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                Candidate
              </th>

              <th>
                Job
              </th>

              <th>
                Stage
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredApplications.length ===
            0 ? (
              <tr>
                <td colSpan="3">
                  No applications found.
                </td>
              </tr>
            ) : (
              filteredApplications.map(
                (application) => (
                  <tr
                    key={application.id}
                  >

                    <td>
                      {application.candidate
                        ?.user
                        ?.username ||
                        application.candidate
                          ?.user
                          ?.email ||
                        "Candidate"}
                    </td>

                    <td>
                      {application.job
                        ?.title ||
                        "Job"}
                    </td>

                    <td>
                      {application.currentStage ||
                        "APPLIED"}
                    </td>

                  </tr>
                )
              )
            )}

          </tbody>
        </table>
      )}

    </div>
  );
}

export default ApplicationList;