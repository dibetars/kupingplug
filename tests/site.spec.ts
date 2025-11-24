import { test, expect } from '@playwright/test';

test.describe('Public site', () => {
  test('Home renders and navbar links exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Enter Site/i })).toBeVisible();
    await page.getByRole('button', { name: /Enter Site/i }).click();
    await expect(page).toHaveURL(/\/about$/);
    const sticky = page.locator('div.sticky');
    await expect(sticky.locator('nav')).toBeVisible();
    await expect(sticky.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(sticky.getByRole('link', { name: 'Gallery' })).toBeVisible();
    await expect(sticky.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(sticky.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('About page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Services page lists packages and additional services', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: /Studio Recording Services/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Additional Studio Services/i })).toBeVisible();
  });

  test('Contact page shows booking info and mailto button', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('link', { name: /Email/i })).toBeVisible();
  });

  test('Gallery lists images or shows no items message', async ({ page }) => {
    await page.goto('/gallery');
    const hasImages = await page.locator('img').count();
    if (hasImages === 0) {
      await expect(page.getByText(/No gallery items/i)).toBeVisible();
    }
  });

  test('Artist detail page loads for Midnight Suns', async ({ page }) => {
    await page.goto('/artist/midnight-suns');
    await expect(page.getByRole('heading', { level: 1, name: /Midnight Suns/i })).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Admin auth and navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Username').fill(process.env.ADMIN_USER || 'admin');
    await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD || 'Admin@Local2025!');
    await page.getByRole('button', { name: /Sign in/i }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('Admin nav shows only admin items and view site', async ({ page }) => {
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Artists' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Content' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Gallery' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'View Site' })).toBeVisible();
  });

  test('Artists list loads and edit link works', async ({ page }) => {
    await page.goto('/admin/artists');
    await expect(page.getByRole('heading', { name: /Manage Artists/i })).toBeVisible();
    const editLinks = page.getByRole('link', { name: /Edit/i });
    const count = await editLinks.count();
    if (count > 0) {
      await editLinks.first().click();
      await expect(page.getByRole('heading', { name: /Edit Artist/i })).toBeVisible();
    }
  });

  test('Create new artist and delete it', async ({ page }) => {
    await page.goto('/admin/artists/new');
    const unique = Date.now().toString();
    const artistName = `Test Artist ${unique}`;
    await page.getByLabel('Artist Name').fill(artistName);
    await page.getByLabel('Bio').fill('A temporary artist for testing');
    await page.getByLabel('Photo URL').fill('/artists/gallery/images/test.png');
    await page.getByRole('button', { name: /Create/i }).click();
    await expect(page).toHaveURL(/\/admin\/artists$/);

    const editLink = page.getByRole('link', { name: 'Edit' }).filter({ hasText: '' });
    await editLink.first().click();
    await expect(page.getByRole('heading', { name: /Edit Artist/i })).toBeVisible();
    await page.getByRole('button', { name: /Delete Artist/i }).click();
    await expect(page).toHaveURL(/\/admin\/artists$/);
  });

  test('Services admin editor saves without error', async ({ page }) => {
    await page.goto('/admin/services');
    await page.getByRole('button', { name: /Save Changes/i }).click();
    await expect(page.getByText(/Saved at/i)).toBeVisible();
  });

  test('Site content admin editor saves without error', async ({ page }) => {
    await page.goto('/admin/content');
    await page.getByRole('button', { name: /Save Changes/i }).click();
    await expect(page.getByText(/Saved at/i)).toBeVisible();
  });

  test('Gallery admin lists images and uploads a file', async ({ page }) => {
    await page.goto('/admin/gallery');
    await expect(page.getByRole('heading', { name: /Gallery/i })).toBeVisible();
    const filePath = 'data/idrcrds.json';
    await page.setInputFiles('input[type="file"]', filePath);
    await page.getByRole('button', { name: /Upload/i }).click();
    await expect(page.getByText(/No images|Images/i)).toBeVisible();
  });
});