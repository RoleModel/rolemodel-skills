# frozen_string_literal: true

# Reference: Model spec patterns
# - Use build for validation tests (no DB writes)
# - Test scopes with let! records covering include AND exclude cases
# - Use contain_exactly for order-independent scope assertions
# - Test methods by verifying return values
# - Skip testing Rails mechanics (associations, enums, delegations)

require 'rails_helper'

RSpec.describe Member do
  describe 'validations' do
    it 'validates the default factory' do
      expect(build(:member)).to be_valid
    end

    it 'requires a name' do
      member = build(:member, name: nil)

      expect(member).not_to be_valid
      expect(member.errors[:name]).to include("can't be blank")
    end
  end

  describe '.active' do
    let!(:active) { create(:member) }
    let!(:archived) { create(:member, :archived) }

    it 'returns only active members' do
      expect(described_class.active).to contain_exactly(active)
    end
  end

  describe '.by_join_date' do
    let!(:older) { create(:member, joined_at: 1.month.ago) }
    let!(:newer) { create(:member, joined_at: 1.day.ago) }

    it 'returns members ordered by most recent first' do
      expect(described_class.by_join_date).to eq([newer, older])
    end
  end

  describe '#days_since_joining' do
    it 'returns the number of days since the member joined' do
      member = build(:member, joined_at: 10.days.ago)

      expect(member.days_since_joining).to eq(10)
    end
  end
end
