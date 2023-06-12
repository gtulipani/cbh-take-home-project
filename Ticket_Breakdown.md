# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here
- I added three actual tickets and a imaginary fourth one with a UI, but since there are no requirements at all I've only left a very basic ticket with a bunch of TBDs.

### Ticket #1: Create new Agents API to set a Custom ID
#### Description
- The report that Facility Team generates for Compliance includes the list of Shifts by Facility ID, where each Shift includes a set of metadata of each agent. As part of that metadata, an `id` is being included, which is retrieved directly from the DB, and does not provide any useful meaning at all.
- This task is part of a Feature Request that consists in changing the `id` being displayed with a custom one that should be updated by members of the Facility Team.
- As part of this task, a new API must be provided with the ability of setting a `customId` for a given agent by the facilities team.
#### Implementation Details
- Multiple changes are required to accomplish this task:

##### Database Changes
- The `id` that's being used in the PDF Compliance Report is the `id` column from the `Agents` table. A new column with name `customId` must be added in that table with the following attributes: `VARCHAR(256)`, `NULLABLE` and `UNIQUE` (add a constraint here).

##### API changes
- Under the existing `/api/v1/agents` resource path, update the existing `PATCH /api/v1/agents/{agentId}` API resource, in order to support this new `customId` field.
- The Request Body is now enhanced with new: `{ "customId": {customId} }` attribute.

- If request succeeds, return a `200 (OK)` with Response Body: `{ "customId": {customId} }`
- If `customId` is empty (NOT NULL), that means that the requester wants to delete the customId. The column must be set as NULL in the DB.
- If invalid request body is provided, return a `400 (Bad Request)` with the same response body schema as the other APIs.
- Apply necessary validations to make sure that the requester is someone from the Facility Team and with proper write-permissions. If someone with invalid permissions is making the request, return a `403 (Forbidden)`.
- If the provided `customId` is already in used by some other agent, return a `409 (Conflict)` explaining the situation.
- For any other unexpected error, return a `500 (Internal Server Error)`.

#### Acceptance Criteria
- As Facilities Team member, I should be able to set a `customId` for a given agent.
- As Facilities Team member, I should be able to unset (delete) the `customId` for a given agent.
- As Facilities Team member, I should NOT be able to set the same `customId` for two different agents.
- As a regular user (not part of the Facilities Team member), I should NOT be able to set a `customId` for a given agent.

#### Effort Estimations
- This task is meant to be completed in 3 Days (1/2 Day for the DB Schema change + migration, and the rest for API and Service layer changes and testing)

#### Unknowns
- ATM it's not clear if we need or not a new index in that table for the new DB column.
- We might want to add new and separate APIs (POST and DELETE) specifically for the `customId` field in the future.

### Ticket #2: Update getShiftsByFacility() to use customId when present
#### Description
- The report that Facility Team generates for Compliance includes the list of Shifts by Facility ID, where each Shift includes a set of metadata of each agent. As part of that metadata, an `id` is being included, which is retrieved directly from the DB, and does not provide any useful meaning at all.
- This task is part of a Feature Request that consists in changing the `id` being displayed with a custom one that should be updated by members of the Facility Team.
- As part of this task, the `getShiftsByFacility()` function must be updated, in order to get not only the `id` but also the new `customId` attribute (when present) for the Agent's metadata.

#### Implementation Details
- The function `getShiftsByFacility()` accepts a FacilityID as parameter and returns all Shifts worked that quarter, including some metadata about the Agent assigned to each.
- As part of that metadata, the `id` is included, which currently belongs to the `id` column from the `Agents` table.
- We need to change the SQL Query that aggregates and returns the data, in order to also return the new `customId` column.

#### Acceptance Criteria
- The `getShiftsByFacility()` should now include the `customId` field in its response.

#### Effort Estimations
- This task is meant to be completed in 1 Day (SQL Query change + tests)

#### Unknowns
- None.

### Ticket #3: Update PDF generated by generateReport() to show customID
#### Description
- The report that Facility Team generates for Compliance includes the list of Shifts by Facility ID, where each Shift includes a set of metadata of each agent. As part of that metadata, an `id` is being included, which is retrieved directly from the DB, and does not provide any useful meaning at all.
- This task is part of a Feature Request that consists in changing the `id` being displayed with a custom one that should be updated by members of the Facility Team.
- As part of this task, the `generateReport()` function must be updated, in order to consume the `customId` column instead of the `id` column (when present).

#### Implementation Details
- The function `generateReport` is called with the list of Shifts as parameter. It converts them into a PDF which can be submitted by the Facility for compliance.
- In the PDF, a table was being created for each Agent's metadata. Currently, the ID is displayed under a column with name `id`.
- We need to change the function to use the `customId` instead of the `id` (when present). This means that i.e. if Agent A has `id: 1` and `customId: abc`, we show `abc`, but if Agent B has `id: 2` but no `customId`, we show `2`.

#### Acceptance Criteria
- As Facilities Team member, I should be able to see the `customId` field in the PDF Report, when present.

#### Effort Estimations
- This task is meant to be completed in 1 Day (Function change + tests)

#### Unknowns
- It's TBD, but we might want to add a legend in the PDF (in a subsequent task) clarifying where the customID comes from (manually set by facilities team).

### Ticket #4: New UI for Facilities Team to set customID
- The report that Facility Team generates for Compliance includes the list of Shifts by Facility ID, where each Shift includes a set of metadata of each agent. As part of that metadata, an `id` is being included, which is retrieved directly from the DB, and does not provide any useful meaning at all.
- This task is part of a Feature Request that consists in changing the `id` being displayed with a custom one that should be updated by members of the Facility Team.
- As part of this task, a new UI must be provided for the Facilities team, so that they can set a `customId` for a given agent.

#### Implementation Details
- Currently, they can update the `customId` through an existing API. The idea is to build a UI for this, but it's still TBD

#### Acceptance Criteria
- TBD

#### Effort Estimations
- TBD

#### Unknowns
- TBD
