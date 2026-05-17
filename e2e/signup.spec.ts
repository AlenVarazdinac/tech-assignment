import { test, expect, type Page } from '@playwright/test'

const emailInput = (page: Page) =>
  page.locator('nord-input[label="Email"]').locator('input')

const passwordInput = (page: Page) =>
  page.locator('nord-input[label="Password"]').locator('input')

const submitButton = (page: Page) =>
  page.getByRole('button', { name: 'Sign Up' })

const newsletterCheckbox = (page: Page) =>
  page.locator('nord-checkbox[label="Receive occasional product updates and announcements"]').locator('input')

const passwordRequirement = (page: Page, label: string) =>
  page.locator('.password-requirements li', { hasText: label })

test.describe('Sign-up page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('nord-card', { state: 'visible' })
  })

  test('shows the sign-up form', async ({ page }) => {
    await expect(page).toHaveTitle('Create an account')
    await expect(page.locator('h2', { hasText: 'Create an account' })).toBeVisible()
    await expect(page.locator('nord-input[label="Email"]')).toBeVisible()
    await expect(page.locator('nord-input[label="Password"]')).toBeVisible()
    await expect(page.locator('nord-checkbox[label="Receive occasional product updates and announcements"]')).toBeVisible()
    await expect(submitButton(page)).toBeVisible()
  })

  test('submit button is disabled until form is valid', async ({ page }) => {
    await expect(submitButton(page)).toBeDisabled()

    await emailInput(page).fill('user@example.com')
    await expect(submitButton(page)).toBeDisabled()

    await passwordInput(page).fill('ValidPass1!')
    await expect(submitButton(page)).toBeEnabled()
  })

  test('shows validation errors on empty fields after interaction', async ({ page }) => {
    await emailInput(page).focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    await expect(page.locator('nord-input[label="Email"]')).toHaveAttribute('error', 'Email is required')
    await expect(page.locator('nord-input[label="Password"]')).toHaveAttribute('error', 'Password is required')
  })

  test('shows email format error for invalid email', async ({ page }) => {
    await emailInput(page).fill('notanemail')
    await emailInput(page).blur()

    await expect(page.locator('nord-input[label="Email"]')).toHaveAttribute('error', 'Enter a valid email address')
  })

  test('clears email error when valid email is entered', async ({ page }) => {
    await emailInput(page).fill('bad')
    await emailInput(page).blur()
    await expect(page.locator('nord-input[label="Email"]')).toHaveAttribute('error', /.+/)

    await emailInput(page).fill('user@example.com')
    await expect(page.locator('nord-input[label="Email"]')).not.toHaveAttribute('error', /.+/)
  })

  test('shows password requirements list while typing', async ({ page }) => {
    await expect(page.locator('.password-requirements')).not.toBeVisible()

    await passwordInput(page).fill('a')
    await expect(page.locator('.password-requirements')).toBeVisible()
    await expect(page.locator('.password-requirements li')).toHaveCount(5)
  })

  test('marks all requirements as met for a strong password', async ({ page }) => {
    await passwordInput(page).fill('ValidPass1!')

    await expect(passwordRequirement(page, 'At least 8 characters')).toHaveClass(/requirement--met/)
    await expect(passwordRequirement(page, 'At least one uppercase letter')).toHaveClass(/requirement--met/)
    await expect(passwordRequirement(page, 'At least one lowercase letter')).toHaveClass(/requirement--met/)
    await expect(passwordRequirement(page, 'At least one number')).toHaveClass(/requirement--met/)
    await expect(passwordRequirement(page, 'At least one special character')).toHaveClass(/requirement--met/)
  })

  test('shows partial requirements as met while password is incomplete', async ({ page }) => {
    // 'Hello' satisfies uppercase and lowercase only
    await passwordInput(page).fill('Hello')

    await expect(passwordRequirement(page, 'At least one uppercase letter')).toHaveClass(/requirement--met/)
    await expect(passwordRequirement(page, 'At least one lowercase letter')).toHaveClass(/requirement--met/)
    await expect(passwordRequirement(page, 'At least 8 characters')).toHaveClass(/requirement--unmet/)
    await expect(passwordRequirement(page, 'At least one number')).toHaveClass(/requirement--unmet/)
    await expect(passwordRequirement(page, 'At least one special character')).toHaveClass(/requirement--unmet/)
  })

  test('toggles password visibility', async ({ page }) => {
    await expect(passwordInput(page)).toHaveAttribute('type', 'password')

    await page.locator('nord-button[aria-label="Show password"]').click()
    await expect(passwordInput(page)).toHaveAttribute('type', 'text')

    await page.locator('nord-button[aria-label="Hide password"]').click()
    await expect(passwordInput(page)).toHaveAttribute('type', 'password')
  })

  test('successful sign-up redirects to /success', async ({ page }) => {
    await emailInput(page).fill('user@example.com')
    await passwordInput(page).fill('ValidPass1!')

    await submitButton(page).click()

    await expect(page).toHaveURL('/success', { timeout: 10000 })
    await expect(page).toHaveTitle('You\'re all set!')
  })

  test('success page shows the registered email', async ({ page }) => {
    await emailInput(page).fill('hello@example.com')
    await passwordInput(page).fill('ValidPass1!')

    await submitButton(page).click()

    await expect(page.locator('strong', { hasText: 'hello@example.com' })).toBeVisible({ timeout: 10000 })
  })

  test('success page shows subscription message when checkbox is checked', async ({ page }) => {
    await emailInput(page).fill('user@example.com')
    await passwordInput(page).fill('ValidPass1!')

    await newsletterCheckbox(page).check()

    await submitButton(page).click()

    await expect(page.locator('text=Thanks for subscribing')).toBeVisible({ timeout: 10000 })
  })

  test('submitting with Enter key works', async ({ page }) => {
    await emailInput(page).fill('user@example.com')
    await passwordInput(page).fill('ValidPass1!')

    await passwordInput(page).press('Enter')

    await expect(page).toHaveURL('/success', { timeout: 10000 })
  })

  test('success page hides subscription message when checkbox is unchecked', async ({ page }) => {
    await emailInput(page).fill('user@example.com')
    await passwordInput(page).fill('ValidPass1!')

    await submitButton(page).click()

    await expect(page).toHaveURL('/success', { timeout: 10000 })
    await expect(page.locator('text=Thanks for subscribing')).not.toBeVisible()
  })
})

test.describe('Auth guard', () => {
  test('redirects unauthenticated users from /success to /', async ({ page }) => {
    await page.goto('/success')
    await expect(page).toHaveURL('/')
  })

  test('allows access to / without authentication', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page).toHaveTitle('Create an account')
  })
})

test.describe('Theme toggle', () => {
  test('toggle button label updates after click', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('nord-card', { state: 'visible' })

    const toggleButton = page.locator('.theme-toggle nord-button')
    const labelBefore = await toggleButton.getAttribute('aria-label')

    await toggleButton.click()

    const labelAfter = await toggleButton.getAttribute('aria-label')
    expect(labelBefore).not.toBe(labelAfter)
  })
})
