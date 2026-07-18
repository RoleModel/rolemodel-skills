# frozen_string_literal: true

# Reference: System spec patterns
# - Test user-visible behavior from the browser
# - Use let! for records that must exist before the page loads
# - After any interaction (visit, click_on), expect content to confirm state
# - Use within blocks to scope interactions
# - One test can cover multiple related assertions

require 'rails_helper'

RSpec.describe 'Team roster', type: :system do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

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

    it 'shows active members' do
      visit roster_path
      expect(page).to have_content('Team Roster')

      expect(page).to have_content('Alice')
      expect(page).to have_content('Bob')
      expect(page).to have_no_content('Charlie')
    end

    it 'shows most recently joined members first' do
      visit roster_path

      rows = page.all('[data-test="member-row"]')
      expect(rows.first).to have_content('Bob')
    end
  end

  describe 'adding a new member' do
    it 'creates a member and shows them on the roster' do
      visit roster_path
      click_on 'Add Member'

      fill_in 'Name', with: 'Dana'
      select 'Developer', from: 'Role'
      click_on 'Save'

      expect(page).to have_current_path(roster_path)
      expect(page).to have_content('Dana')
    end
  end
end
