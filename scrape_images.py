import requests

for i in range(899):
	print("Getting sprite {}/{}".format(i, 898))
	url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{}.png".format(i)
	resp = requests.get(url, allow_redirects=True)
	with open("sprites/pokemon/{}.png".format(i), "wb") as sprite:
		sprite.write(resp.content)

