package api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.ChatbotService;
import dto.ChatRequest;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173") // adjust for your React app
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public String chat(@RequestBody ChatRequest request) {
        return chatbotService.getResponse(request.getMessage());
    }
}
