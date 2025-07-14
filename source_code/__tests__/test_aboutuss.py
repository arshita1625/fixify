import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

class TestAboutUsPage(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Setup WebDriver before running tests"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.get("http://localhost:5173/aboutus")
    def test_page_title(self):
        """Verify page title contains 'About Us'"""
        self.assertIn("Fixify", self.driver.title)
        
    def test_logo_displayed(self):
        """Check if the logo is visible"""
        logo = self.driver.find_element(By.TAG_NAME, "img")
        self.assertTrue(logo.is_displayed())

    def test_about_us_section(self):
        """Verify 'ABOUT US' section is present"""
        about_title = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'ABOUT US')]")
        about_text = self.driver.find_element(By.XPATH, "//p[contains(text(), 'Welcome to FIXIFY!')]")
        about_video = self.driver.find_element(By.TAG_NAME, "video")

        self.assertTrue(about_title.is_displayed())
        self.assertTrue(about_text.is_displayed())
        self.assertTrue(about_video.is_displayed())

    def test_team_section(self):
        """Check 'MEET OUR TEAM' section and verify team members"""
        team_title = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'MEET OUR TEAM')]")
        self.assertTrue(team_title.is_displayed())

        team_names = ["Arshita", "Geetika", "Bhargav", "Raghul", "Rajveer", "Rithik"]
        for name in team_names:
            name_element = self.driver.find_element(By.XPATH, f"//p[contains(text(), '{name}')]")
            self.assertTrue(name_element.is_displayed())

    @classmethod
    def tearDownClass(cls):
        """Close the browser after tests"""
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()