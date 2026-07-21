# frozen_string_literal: true

# Reference: Model spec patterns
# - Test scopes, validations, and methods with meaningful logic
# - Skip testing Rails mechanics (associations, enums, delegations)
# - Use build for validation tests (no DB writes)
# - Structure: describe the method, context for each scenario, it for the assertion
# - Test names should read as documentation: rspec --format documentation

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

    it 'requires a unique email' do
      create(:member, email: 'alice@example.com')
      member = build(:member, email: 'alice@example.com')

      expect(member).not_to be_valid
      expect(member.errors[:email]).to include('has already been taken')
    end
  end

  describe '.active' do
    let!(:active) { create(:member) }
    let!(:archived) { create(:member, :archived) }

    it 'returns members who are not archived' do
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
    context 'when the member joined 10 days ago' do
      it 'returns 10' do
        member = build(:member, joined_at: 10.days.ago)

        expect(member.days_since_joining).to eq(10)
      end
    end

    context 'when the member joined today' do
      it 'returns 0' do
        member = build(:member, joined_at: Time.current)

        expect(member.days_since_joining).to eq(0)
      end
    end
  end
end
