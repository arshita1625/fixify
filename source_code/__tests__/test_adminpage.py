import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
class TestAdminPage(unittest.TestCase):
    def setUp(self):
        # Set up the WebDriver before each test
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.wait = WebDriverWait(self.driver, 10)

    def test_admin_login(self):
        self.driver.get("http://localhost:5173/signin")

        username_field = self.driver.find_element(By.NAME, "username")
        password_field = self.driver.find_element(By.NAME, "password")
        login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")

        username_field.send_keys("admin")
        password_field.send_keys("admin")
        login_button.click()

 
        time.sleep(2)
        print("URL after login:", self.driver.current_url)
        self.driver.get("http://localhost:5173/admin")

        try:
            # Wait up to 20 seconds for any element with the expected text
            self.wait = WebDriverWait(self.driver, 20)
            self.wait.until(EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Welcome to Admin Dashboard')]")
            ))
        except Exception as e:
            self.driver.save_screenshot("admin_login_failure.png")
            print("❌ Failed to detect dashboard heading. Screenshot saved as admin_login_failure.png")
            raise e

        # Continue assertions
        welcome_text = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Welcome to Admin Dashboard')]")
        self.assertIn("Welcome to Admin Dashboard", welcome_text.text)

        total_customers = self.driver.find_element(By.XPATH, "//h6[contains(text(), 'Total Customers')]")
        self.assertTrue(total_customers.is_displayed())

        print("✅ Admin login test passed successfully!")

    def tearDown(self):
        # Close the browser after each test
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()