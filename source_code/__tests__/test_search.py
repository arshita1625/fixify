import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class FindServicePageTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:5173/findService")

    def tearDown(self):
        self.driver.quit()

    def test_components_displayed(self):
        """Test if all necessary components are displayed on the FindService page."""
        wait = WebDriverWait(self.driver, 10)

        # Navbar2 components
        self.assertTrue(wait.until(EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Skills ▼')]"))).is_displayed())
        self.assertTrue(wait.until(EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Rating ▼')]"))).is_displayed())
        self.assertTrue(wait.until(EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Price ▼')]"))).is_displayed())

        # Profile cards
        profile_cards = self.driver.find_elements(By.CLASS_NAME, "profile-card")
        self.assertTrue(len(profile_cards) > 0)

        # Check for elements inside the first profile card (sample check)
        first_card_name = wait.until(EC.visibility_of_element_located((By.XPATH, "(//div[@class='profile-card']//h3)[1]"))).text
        self.assertTrue(first_card_name != '')

        # Check contact button is present.
        self.assertTrue(wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "contact-btn"))).is_displayed())

    def test_rating_sort_high_to_low(self):
        """Test sorting profiles by rating (high to low)."""
        wait = WebDriverWait(self.driver, 10)
        rating_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Rating ▼')]")))
        rating_button.click()

        high_to_low_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='High to Low']")))
        high_to_low_button.click()

        profile_cards = self.driver.find_elements(By.CLASS_NAME, "profile-card")
        ratings = []
        for card in profile_cards:
            try:
                rating_text = card.find_element(By.XPATH, ".//p[contains(., '/ 5')]").text
                if rating_text:
                    rating = float(rating_text.split('/')[0].split(' ')[-1])
                    ratings.append(rating)
            except:
                pass #if the element is not found, or the text is malformed, just move on.

        for i in range(len(ratings) - 1):
            if ratings:
                self.assertTrue(ratings[i] >= ratings[i + 1])

if __name__ == "__main__":
    unittest.main()