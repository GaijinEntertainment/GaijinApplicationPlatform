## Item format


#### Required fields:

- `name_english` (_string_) - name of the item, may not be unique.
- `itemdefid` (_positive int_) - The code/identifier of ItemDef must be unique within the game. It is involved in recipes, generators, and bundles.
- `type` (_string_) - type of the itmem, possible values:
  - `item` - Simple item that can be found in the user's inventory
  - `bundle` - Bundle item. Once a user obtains a bundle through any means, it immediately unfolds into a set of new items listed in the 'bundle' field.
  - `generator` - Roulette item. Once a user obtains a generator, it opens up, issuing one new item randomly selected from the list of items listed in the 'bundle' field.
  - `playtimegenerator` - Special form of generator triggered by calling TriggerItemDrop from the game client or other servers.
  - `delayedexchange` - Special form of bundle with a non-zero 'lifetime'. Characteristics:
      - Alongside item instances, delayed exchange instances can exist in the user's inventory.
      - Must have filled fields 'bundle' and 'exchange'.
      - Cannot be marketable or tradable.
      - Must have a non-empty 'lifetime' field, determining the item's lifespan. Upon expiration, the item unfolds as a bundle.
      - During its lifespan, it can be transformed back into the set of items from which it was created."

#### Optional fields:

- `name_{language}` (_string_) - The localized name of the item. If not available for a specific language, the value of 'name_english' is used. See available languages below.
- `description_{language}` (_string_) - The localized description of the item. See available languages below.
- `item_quality` (_positive_int_) - The quality of the item
- `deprecated` (_bool_) - If true, the item is not displayed to the client/market, cannot be used in crafting or obtained as a result of crafting/bundle opening, and does not participate in dependency calculations when loading configs.
- `hidden` (_bool_)- Is it allowed to send the description of this item to the client? It is used to hide unused or currently unprepared items.
- `lifetime` (_string_) - The duration of an item's lifespan after its acquisition. Specified as a number with a single-letter suffix: s (seconds), m (minutes), h (hours), d (days), w (weeks) respectively.
- `lifetime_modifier` (_string_) - Optional Squirrel code returning a multiplier for lifetime. The script is provided with a table 's', containing keys in the format count_NNN, each of which contains the quantity of corresponding items in the player's profile
- `expireAt` - Timestamp. After the specified date, the item disappears.
- `exchange` - Crafting recipes that create this item. See exchange format below.
- `bundle` - Defines behavior for bundles, generators, and playtime generators. See bundle format below.
- `required_items` - Defines requirements for adding this item using the command. See format below.
- `bundle_hidden` (_bool_)- Should the list of items in the bundle be sent to the client? If the value is true, the client will not know the list of items contained in the chest.
- `premium` - The duration of the added item's premium account time. It is specified as a number with a single-letter suffix: s for seconds, m for minutes, h for hours, d for days, w for weeks, respectively.
- `store_hidden` - If true, do not display in the store. This refers to the in-game store using the GetItemPrices / ClnPurchaseItem API, i.e., for gold without offers.
- `store_tags` - A set of tags for the store, separated by semicolons.
- `meta`` - Custom game specific information.
  Purch service
- `granted_by_purch` - Determines the purchase GUID on the purch server(purchase for real money), which leads to the issuance of this item. The same GUID can be specified for more than one itemdef, and all items will be issued. It can be attached to bundles/generators. It makes sense to also set a reasonable tradable_delay_sec to avoid fraudsters selling items purchased through purch on the market.
- `limitOnPurchase` - This parameter sets a limit on the number of items that can be purchased. If a player already owns one such item, they can only purchase two more. If a player has three of these items, the purchase is not possible. This restriction does not apply to adding items through other means.

  Market not supported on GAP right now
- `market_hash_name` -String identifier of the item used by the market. If not specified and the item has the marketable = true flag set, it is copied from the English localization. Once assigned (either by copying from localization or by direct specification in the schema), it resists changes to prevent breaking the market. In case of urgent necessity, it can be changed by transferring the item to a neighboring config with simultaneous change of market_hash_name. In most cases, it is unique, but if necessary, it can be shared among multiple items, which then fall into the same market listing.
- `marketable` (_bool_) - The flag determines whether such items are allowed to be sold on the market.
- `market_fee` (_float_)- A fractional value from 0 to 0.95, representing a portion of the transaction amount on the exchange taken as a commission. It is divided between the exchange and beneficiaries.
- `tradable_delay_sec` (_positive int_) - The time (in seconds) during which neither the item itself nor its derivatives obtained through crafting can be sold by the player. To increase the efficiency of caching item descriptions on the market, the effective time is always rounded up to the nearest hour, i.e., an item purchased at 11:50:02 with a 15-minute selling restriction will not be available for sale until 13:00:00.
- `background_color` - The background color of item icon in the inventory and on the market. Color represents in hex color format: RRGGBB. 
- `name_color` - The name color of item icon in the inventory and on the market. Color represents in hex color format: RRGGBB. 
- `icon_url` - The image for the inventory and market.
- `icon_url_large` - Similar to "icon_url," but the recommended resolution should be larger, typically at least 800x600 pixels. Primarily intended for web use and dialogs where a large image is required. An additional agreement applies to them: controls attempting to display "icon_url_large" will show "icon_url" if "icon_url_large" is an empty string.
- `price` - The price (for selling through the store) is individual for different currencies. See the format below.
- `tags` - Tags for the market. They consist of key-value pairs separated by semicolons. Keys can contain letters, numbers, and underscores. Values can contain letters, numbers, underscores, and hyphens. Keys are unique.


#### Available localization languages

  - `english`
  - `brazilian`
  - `bulgarian`
  - `czech`
  - `danish`
  - `dutch`
  - `finnish`
  - `french`
  - `german`
  - `greek`
  - `hungarian`
  - `italian`
  - `japanese`
  - `koreana`
  - `norwegian`
  - `polish`
  - `portuguese`
  - `romanian`
  - `russian`
  - `schinese`
  - `spanish`
  - `swedish`
  - `tchinese`
  - `thai`
  - `turkish`
  - `arabic`
  - `ukrainian`


#### Exchange format

The crafting recipes are listed separated by semicolons: _recipe_;_recipe_
Each recipe consists of one or more ingredients listed separated by commas: _ingredient_,_ingredient_

An ingredient can be an itemdef or contain multiple choices [itemdef1, itemdef2]. If multiple items are to be used, it's followed by 'x' and a number. In the case of multiple choices, itemdefid can be spent in any combination.

"[", premium"] [", unfiltered"] [", auxiliary"] [",require=" _requirement_0] [", req_items=" _itemdefid_ { "+" _itemdefid_ }] [", req_unlocks=" __unlock_name_{"+"_unlock_name_}

Requirements are described as ItemDefId and an optional quantity indicated by 'x': itemdefid: _itemdefid_ [ "x" _quantity_ ]

Having the 'premium' flag requires an active premium for crafting (see the 'premium' field).

The 'unfiltered' flag allows issuing items from crafting even if the requirement specified in the 'required_items' field of their descriptions is not met.

The 'auxiliary' flag marks the recipe as auxiliary, preventing it from being used to generate drop descriptions for itemdefid ingredients.

In the absence of a requirement, the game client can call the ExchangeItems API with the desired resulting item's ItemDefId and a list of items chosen as ingredients. The server will compare the recipes and perform the exchange if a suitable one is found.

Having a requirement means that this recipe can only be used by a trusted server via the ExchangeItemsTrusted API call. By sending a request including this recipe and the requirement, the trusted server confirms that the requirement is met for the client. The mechanism of the client's interaction with the trusted server and the requirement verification is not regulated.

An additional list of ingredients, req_items, describes the items necessary for using this recipe. The items themselves are not consumed. The + sign is used as a separator for the list of ingredients.

The req_unlocks list specifies the unlocks required for this recipe. Unlocks are requested from the user state. The following comparison conditions for unlock stages are allowed: <, <=, ==, !=, >=, >. For example, unlock_name > 5 means that if the unlock stage is greater than 5, the condition for using the recipe is met. The sign and value may not be specified, only the unlock name. Such a notation is equivalent to: unlock_name >= 1

The + sign is used as a separator for unlocks.

The list of recipes can be specified for regular items as well as for bundles or generators, allowing for the creation of equivalents to our chests.


Example:
  Suppose there's an item we issue, typically a generator or a bundle.
  There are items that serve as ingredients, which people, for some reason, distinguish between keys and chests, even though logically they only differ by their image.
  In the issued item, you need to describe the crafting formula, for example: exchange:"123,124,125;222,123"
  These are two crafting formulas separated by ";", with ingredients for each separated by ","
  They signify that this item can be created from three ingredients: 123 (chest), 124 (match), and 125 (dynamite), or from two: 222 (key) and 123 (chest)."

More complex example:
"[40110,40111]x3,40207,premium,unfiltered;100101,10001,require=SomeRequirement;40973,auxiliary;200132,req_items=40291x3+40295,req_unlocks=killer>=3+loser"


#### Bundle format

In the case of a bundle ('type':'bundle' or 'type':'delayedexchange'), it specifies a list of items to be issued, along with their type and quantity. For example, '40110x3;40207;40973' instructs to issue three instances of item 40110 and one each of items 40207 and 40973.

In the case of a generator ('type':'generator' or 'type':'playtimegenerator'), it specifies a list of items that this generator can issue with relative weights. For example, '40110x3;40207;40973x16' means that item 40110 will drop with a probability of 15%, item 40207 with a probability of 5%, and item 40973 with a probability of 80%. Sometimes it may be convenient to specify weights directly in percentages, such as '40110x15;40207x5;40973x80', but in this case, one must ensure that the sum totals 100%.

Issuing with shuffling. Using the postfix 'S' ensures that the item will be issued using shuffling. For example, '40110x3;4020x20;40973x2S' means that items 40110 and 4020 will be issued with fair randomness, and item 40973x2S will be issued with an 8% chance using shuffling. Shuffle guarantees the mandatory issuance of an item (100%) for no more than N * IntervalsPercent / 100 generations, where N is the number of attempts between drops with uniform distribution (ceil((3+2+20)/2) = 13), and IntervalsPercent is set in the config 'maxIntervalsPercent': {'10': 160, '100': 400, '20': 200} - the first number is the drop probability, and the second is the multiplier. Since 8% < 10, IntervalsPercent = 160. The maximum number of generations before 100% issuance is ceil(13*160/100) = 21. With shuffling, multiple items can be issued, e.g., '40110x3S;4020x20;40973x2S'. Shuffle is recommended for items with low drop probabilities (up to 10%).

Issuing with a limited number of times. Using the postfixes 'D' and 'L' ensures that items are issued a limited number of times. These postfixes are incompatible with each other and with shuffling for one item, i.e., you can use either S, D, or L. In a bundle, for different items, you can combine items with and without any postfix. Items with limitations are issued similarly to regular items without postfixes in random order.

D means limiting the issuance of the item by the generator to a certain number of times (disposable).

'4020x20D3;4021x10D;' means that item 4020 will be issued only 3 times with a 'probability' of 20. Item 4021 will be issued only once with a probability of 10. If these items are the only ones in the bundle, the generator will stop issuing items after 4 attempts.

L means that after these items have been issued a certain number of times, they will start being issued again (looped).

'4022x20L2;4023x20L' In this case, item 4022 will be issued twice (in random order) and item 4023 once. Then these items will start being issued again.

Issuing with item existence check

Using the postfix 'U' (unique) ensures that the item will be issued only if the player does not already possess it. The postfix is not compatible with the postfixes L and D but compatible with S.

If the player does not have such an item, the generator will issue it according to the specified probabilities, but only once (as long as the player has the item).

It is possible to specify one or several additional items for the 'U' postfix. In this case, the presence of the main and all additional items will be checked. If at least one of them is present, the item will not be issued.

example of specifying additional items

2347U111 - one additional item 111. When generating, both item 2347 and 111 will be checked, if one of them is present, item 2347 will not be issued.

4021U[111, 112] - an array of additional items. Items 4021, 111, and 112 will be checked.

Using S and U together

The order of prefixes is important, first S then U! example: 2347x1SU

when using S and U, the item will also be issued only once, but the deck will not be reshuffled, the unique item will simply be skipped, and the next one from the deck will be issued.

example: 2347x1SU; 1234x 99 - generator with a unique shuffled item 2345 and a regular item 1234.

It should be noted that by using postfixes, you can create a generator that cannot issue anything - for example, by using the D and U postfixes.

when issuing items with D and U, the shuffled items do not change their probability. The deck is considered the same size, cards with D and U postfixes are not removed from it. If an unshuffled card is drawn, D and U are taken into account. Thus, you can use all the postfixes in one bundle, but you need to take into account the features described above."

Examples:
"40110x3;40207x96;40973"

"40110x3;4020x20;40973x2S"

"40110x3;4020x20D3;4021x10D;40973x2S;4022x20L2;4023x20L"

"1123U; 2347U111; 4021U[111, 112]; 1212x3"

"1123x1SU; 1212x3"


#### Required items format

Defines requirements for issuing this item using the AddItem command, dropping it from bundles obtained through crafting, and directly crafting it. For the issuance to be successful or the craft to occur, the condition specified here must be met. This does not affect obtaining the item by purchasing it on the market or in the store.

In format, this field resembles a bundle, but in addition to ";" (logical "and"), "," (or), "!" (not), and parentheses are also permitted. "Or" operations have higher precedence than "and," i.e., "1;2,3" is equivalent to "1;(2,3)". Spaces are allowed anywhere except within itemdefid.

Examples:
"40110x3;40207x2;40973"

"(!5; 6 x 2; 3), ( 7x3; ( (3;!(5,4)), (5;4;!3) ) )"


#### Price format

Price: _version_;_pricelist_
Version: "1"
_pricelist_: _originalprice_;_price_
_originalprice_: _currency_ _integer_,_currency_ _integer_
_price_: _daterange_ _currency_ _integer_ _currency_ _integer_
_currency_: 3 letters, for example, "USD"
_integer_: 1 to 6 digits
_daterange_: YYYYMMDDTHHMMSSZ-YYYYMMDDTHHMMSSZ

Examples:

"1;USD100" - ($1.00)

"1;USD100,EUR080;20130606T080000Z-20130609T080000ZUSD50,EUR40" - ($1.00 or 0.80 euros, but from 2013-06-06 to 2013-06-09 the price is reduced to $0.50 or 0.40 euro)