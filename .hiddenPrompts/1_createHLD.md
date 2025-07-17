I want to develop a small service that will manage system prompts.
We need to support versioning for these prompts. All prompts are immutable after creation. So they can be deleted, copied to create a new one, but never edited.
These prompts will be loaded by different AI tools via REST API calls.
Each prompt should have the following metadata:

promptKey – unique key for each prompt (same key for multiple versions of the same prompt). This key will be used to retrieve the relevant prompt from the API.

isActive – boolean that defines if this version of the prompt is the production/active one. There should be only one active version for all prompts with the same key.

dateCreation – when the prompt was created.
modelName – name of the LLM that this prompt is defined for (GPT-4o, Sonnet 3.7, etc.)
AI, think about two or three more fields that might be relevant.

Functionality:
Create new prompts with a new promptKey.
Create a new version of an existing prompt.
Define the active prompt.
Delete prompt (inactive only).

Please describe all this nicely. Should cover DB, BE, FrontEnd.
Not too deep, on a high level.

<!-- Might create directory structure -->