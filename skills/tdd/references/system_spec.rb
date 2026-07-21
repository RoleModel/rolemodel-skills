# frozen_string_literal: true

# Reference: System spec patterns
# - Test user-visible behavior from the browser
# - Outside-in: start here, let failures pull you to model/controller specs
# - Use let! for records that must exist before the page loads
# - Structure tests as Given (setup) / When (action) / Then (assertion)
# - Use within blocks to scope interactions
# - Test names should read as documentation: rspec --format documentation

require 'rails_helper'

RSpec.describe 'Team roster', type: :system do
  let(:user) { create(:user, :admin) }

  before { sign_in user }

  describe 'viewing the roster' do
    let!(:active_member) do
      create(:member, name: 'Alice', role: 'Developer', joined_at: 1.month.ago)
    end

    let!(:recent_member) do
      create(:member, name: 'Bob', role: 'Designer', joined_at: 1.day.ago)
    end

    let!(:archived_member) do
      create(:member, :archived, name: 'Charlie')
    end

    it 'shows active members ordered by most recently joined' do
      visit roster_path
      expect(page).to have_content('Team Roster')

      expect(page).to have_content('Alice')
      expect(page).to have_content('Developer')
      expect(page).to have_content('Bob')
      expect(page).to have_no_content('Charlie')

      rows = page.all(data_test('member-row'))
      expect(rows.first).to have_content('Bob')
    end
  end

  describe 'filtering by status' do
    let!(:active_member) { create(:member, name: 'Alice') }
    let!(:archived_member) { create(:member, :archived, name: 'Charlie') }

    it 'reveals archived members when the filter is toggled' do
      visit roster_path
      expect(page).to have_content('Team Roster')

      click_on 'Show Archived'

      expect(page).to have_content('Charlie')
    end
  end

  describe 'adding a new member' do
    it 'creates a member and returns to the roster' do
      visit roster_path
      expect(page).to have_content('Team Roster')

      click_on 'Add Member'

      fill_in 'Name', with: 'Dana'
      select 'Developer', from: 'Role'
      click_on 'Save'

      expect(page).to have_current_path(roster_path)
      expect(page).to have_content('Dana')
    end
  end

  context 'when the user is not an admin' do
    let(:user) { create(:user) }

    it 'redirects to the dashboard' do
      visit roster_path

      expect(page).to have_current_path(dashboard_path)
    end
  end
end
