jsTree Google Reader Counter Plugin

In order to use this plugin you need a up and running jsTree (http://www.jstree.com)
in your webapp.

Works and behaves like Google Reader subscriptions tree.
No further explanation. Look at the screenshot.png :-)


== Public API ==

Initialization:

$('#jstree').jstree({
    "counter" : { 
        "text_limit" : "42", 
        "new_entry_class" : "new-entry"
    },
    "plugins": [
        "counter"
    ]
});


Increase or decrease counter of one leaf at a time:

decrease(selector)

increase(selector)

Example:

$("#jstree").jstree("increase","#leaf_dom_id")


== TODO ==

Restrict increase/decrease only to leaf nodes. Validate incoming selector against node types.