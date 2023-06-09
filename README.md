### In Development
Creating an action to add issues to a tracking issue's tasklist when a milestone is added.

### TODO
- Make tasklist title configurable via action inputs
- Decide on strategy for demilestoning (leave tracking issue alone vs. remove issue)

# Add to tracking issue action

This action adds an issue to a "tracking issue" when the issue is added to a milestone.
A tracking issue is an issue in the milestone that contains a tasklist filled with relevant issues.

## Inputs

### tracking-issue-label

**Optional** The label that will be used to identify the tracking issue. Default `tracking-issue`.

## Example usage

```yaml
  uses: underwoo16/add-to-tracking-issue
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    tracking-issue-label: 'tracking-issue'
```
